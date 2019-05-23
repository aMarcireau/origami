const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const request = require('request');
const readline = require('readline');
const stream = require('stream');
const archiver = require('archiver');
const zlib = require('zlib');
const urlTemplate = require('url-template');

function isSmallerThan(firstVersion, secondVersion) {
    if (firstVersion.major !== secondVersion.major) {
        return firstVersion.major < secondVersion.major;
    }
    if (firstVersion.minor !== secondVersion.minor) {
        return firstVersion.minor < secondVersion.minor;
    }
    return firstVersion.patch < secondVersion.patch;
}

function areEqual(firstVersion, secondVersion) {
    return (
        firstVersion.major === secondVersion.major
        && firstVersion.minor === secondVersion.minor
        && firstVersion.patch === secondVersion.patch
    );
}

const semver = /^v([1-9]\d*|0)\.([1-9]\d*|0)\.([1-9]\d*|0)(?:-([0-9A-Za-z-\.]+)$|$)/;

const versionAsString = JSON.parse(fs.readFileSync(`${path.dirname(__dirname)}/source/package.json`)).version;
const semverMatch = semver.exec(`v${versionAsString}`);
if (!semverMatch) {
    console.error('The version number does not have the expected format');
    process.exit(1);
}
const version = {
    major: parseInt(semverMatch[1]),
    minor: parseInt(semverMatch[2]),
    patch: parseInt(semverMatch[3]),
    identifier: semverMatch[4] ? semverMatch[4] : null,
};

// check the links' version in README.md
if (version.identifier == null) {
    const simpleSemver = /([1-9]\d*|0)\.([1-9]\d*|0)\.([1-9]\d*|0)/g;
    const readme = fs.readFileSync(`${path.dirname(__dirname)}/README.md`).toString('utf8');
    for (;;) {
        const simpleSemverMatch = simpleSemver.exec(readme);
        if (simpleSemverMatch == null) {
            break;
        }
        const readmeVersion = {
            major: parseInt(simpleSemverMatch[1]),
            minor: parseInt(simpleSemverMatch[2]),
            patch: parseInt(simpleSemverMatch[3]),
            identifier: null,
        };
        if (!areEqual(version, readmeVersion)) {
            const lines = readme.substring(0, simpleSemverMatch.index).split('\n');
            let position = simpleSemverMatch.index;
            for (const line of lines.slice(0, lines.length - 1)) {
                position -= (line.length + 1);
            }
            console.error(`Bad version number in README.md on line ${lines.length}:${position + 1}`);
            process.exit(1);
        }
    }
}

const usernameInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
});
usernameInterface.question('username: ', username => {
    usernameInterface.close();
    const passwordInterface = readline.createInterface({
        input: process.stdin,
        output: new stream.Writable({
            write: (chunk, encoding, callback) => {
                callback();
            },
        }),
        terminal: true,
    });
    passwordInterface.question('', password => {
        passwordInterface.close();
        process.stdout.write('\n');
        request.post({
            url: 'https://api.github.com/repos/amarcireau/origami/releases',
            auth: {
                user: username,
                pass: password,
                sendImmediately: true,
            },
            headers: {'user-agent': 'origami'},
            json: {
                tag_name: `v${versionAsString}`,
                draft: true,
                prerelease: false,
            },
        }, (error, httpIncomingMessage, body) => {
            if (error) {
                console.error('https://api.github.com/repos/amarcireau/origami/releases', error);
                process.exit(1);
            }
            if (httpIncomingMessage.statusCode !== 201) {
                console.error('https://api.github.com/repos/amarcireau/origami/releases', body);
                process.exit(1);
            }
            const id = body.id;
            console.log(`Created the release v${versionAsString} (id: ${id})`);
            request.get({
                url: `https://api.github.com/repos/amarcireau/origami/releases/${id}`,
                auth: {
                    user: username,
                    pass: password,
                    sendImmediately: true,
                },
                headers: {'user-agent': 'origami'},
                json: true,
            }, (error, httpIncomingMessage, body) => {
                if (error) {
                    console.error(`https://api.github.com/repos/amarcireau/origami/releases/${id}`, error);
                    process.exit(1);
                }
                if (httpIncomingMessage.statusCode !== 200) {
                    console.error(`https://api.github.com/repos/amarcireau/origami/releases/${id}`, body);
                    process.exit(1);
                }
                try {
                    fs.mkdirSync(`${path.dirname(__dirname)}/build/archives`);
                } catch (error) {}
                let directoriesLeft = 0;
                for (const directoryToZip of fs.readdirSync(`${path.dirname(__dirname)}/build`)) {
                    if (fs.lstatSync(`${path.dirname(__dirname)}/build/${directoryToZip}`).isDirectory()) {
                        const matchedConfiguration = /^Origami-([^-]+)-([^-]+)$/.exec(directoryToZip);
                        if (matchedConfiguration != null) {
                            ++directoriesLeft;
                            const output = fs.createWriteStream(`${path.dirname(__dirname)}/build/archives/${directoryToZip}.zip`);
                            output.on('close', () => {
                                console.log(`Created '${path.dirname(__dirname)}/build/archives/${directoryToZip}.zip'`);
                                fs.readFile(`${path.dirname(__dirname)}/build/archives/${directoryToZip}.zip`, (error, archive) => {
                                    if (error) {
                                        console.error(`${path.dirname(__dirname)}/build/archives/${directoryToZip}.zip`, error);
                                        process.exit(1);
                                    }
                                    request.post({
                                        url: urlTemplate.parse(body.upload_url).expand({name: `${directoryToZip}.zip`}),
                                        auth: {
                                            user: username,
                                            pass: password,
                                            sendImmediately: true,
                                        },
                                        headers: {
                                            'user-agent': 'origami',
                                            'Content-Type': 'application/zip',
                                        },
                                        body: archive,
                                    }, (error, httpIncomingMessage, body) => {
                                        if (error) {
                                            console.error(urlTemplate.parse(body.upload_url).expand({name: `${directoryToZip}.zip`}), error);
                                            process.exit(1);
                                        }
                                        if (httpIncomingMessage.statusCode !== 201) {
                                            console.error(urlTemplate.parse(body.upload_url).expand({name: `${directoryToZip}.zip`}), body);
                                            process.exit(1);
                                        }
                                        console.log(`Uploaded '${directoryToZip}'`);
                                        --directoriesLeft;
                                        if (directoriesLeft === 0 && version.identifier == null) {
                                            request.get({
                                                url: 'https://api.github.com/repos/amarcireau/origami/releases',
                                                auth: {
                                                    user: username,
                                                    pass: password,
                                                    sendImmediately: true,
                                                },
                                                headers: {'user-agent': 'origami'},
                                                json: true,
                                            }, (error, httpIncomingMessage, body) => {
                                                if (error) {
                                                    console.error('https://api.github.com/repos/amarcireau/origami/releases', error);
                                                    process.exit(1);
                                                }
                                                if (httpIncomingMessage.statusCode !== 200) {
                                                    console.error('https://api.github.com/repos/amarcireau/origami/releases', body);
                                                    process.exit(1);
                                                }
                                                const releasesAndVersionsToPurge = [];
                                                for (const release of body) {
                                                    if (release.id !== id) {
                                                        const releaseSemverMatch = semver.exec(release.tag_name);
                                                        if (releaseSemverMatch) {
                                                            const releaseVersion = {
                                                                major: parseInt(releaseSemverMatch[1]),
                                                                minor: parseInt(releaseSemverMatch[2]),
                                                                patch: parseInt(releaseSemverMatch[3]),
                                                                identifier: releaseSemverMatch[4] ? releaseSemverMatch[4] : null,
                                                            };
                                                            if (release.draft) {
                                                                request.delete({
                                                                    url: `https://api.github.com/repos/amarcireau/origami/releases/${release.id}`,
                                                                    auth: {
                                                                        user: username,
                                                                        pass: password,
                                                                        sendImmediately: true,
                                                                    },
                                                                    headers: {'user-agent': 'origami'},
                                                                    json: true,
                                                                }, (error, httpIncomingMessage, body) => {
                                                                    if (error) {
                                                                        console.error(
                                                                            `https://api.github.com/repos/amarcireau/origami/releases/${release.id}`,
                                                                            error
                                                                        );
                                                                        process.exit(1);
                                                                    }
                                                                    if (httpIncomingMessage.statusCode !== 204) {
                                                                        console.error(
                                                                            `https://api.github.com/repos/amarcireau/origami/releases/${release.id}`,
                                                                            body
                                                                        );
                                                                        process.exit(1);
                                                                    }
                                                                    console.log(`${release.tag_name} (${release.id}) deleted (it was a draft)`);
                                                                });
                                                            } else if (releaseVersion.identifier) {
                                                                console.log(`${release.tag_name} (${release.id}) has an identifier: skipping automatic operations`);
                                                            } else if (
                                                                isSmallerThan(version, releaseVersion)
                                                                || areEqual(version, releaseVersion)
                                                            ) {
                                                                console.log(`${release.tag_name} (${release.id}) is greater than or identical to the current version: skipping automatic operations`);
                                                            } else {
                                                                releasesAndVersionsToPurge.push({
                                                                    release: release,
                                                                    version: releaseVersion,
                                                                });
                                                            }
                                                        } else {
                                                            console.log(`${release.tag_name} (${release.id}) does not have the expected format: skipping automatic operations`);
                                                        }
                                                    }
                                                }
                                                let previousMajorVersion = null;
                                                let previousMinorVersion = null;
                                                for (const releaseAndVersion of releasesAndVersionsToPurge) {
                                                    if (
                                                        releaseAndVersion.version.major < version.major - 1
                                                        || (
                                                            releaseAndVersion.version.major === version.major
                                                            && releaseAndVersion.version.minor < version.minor - 1
                                                        )
                                                        || (
                                                            releaseAndVersion.version.major === version.major
                                                            && releaseAndVersion.version.minor === version.minor
                                                        )
                                                    ) {
                                                        continue;
                                                    }
                                                    if (
                                                        releaseAndVersion.version.major === version.major - 1
                                                        && (
                                                            previousMajorVersion == null
                                                            || isSmallerThan(previousMajorVersion, releaseAndVersion.version)
                                                        )
                                                    ) {
                                                        previousMajorVersion = releaseAndVersion.version;
                                                        continue;
                                                    }
                                                    if (
                                                        releaseAndVersion.version.major === version.major
                                                        && releaseAndVersion.version.minor === version.minor - 1
                                                        && (
                                                            previousMinorVersion == null
                                                            || isSmallerThan(previousMinorVersion, releaseAndVersion.version)
                                                        )
                                                    ) {
                                                        previousMinorVersion = releaseAndVersion.version;
                                                        continue;
                                                    }
                                                }
                                                console.log(previousMajorVersion == null ? 'There is no previous major version' : `Previous major version preserved: v${previousMajorVersion.major}.${previousMajorVersion.minor}.${previousMajorVersion.patch}`);
                                                console.log(previousMinorVersion == null ? 'There is no previous minor version' : `Previous minor version preserved: v${previousMinorVersion.major}.${previousMinorVersion.minor}.${previousMinorVersion.patch}`);
                                                for (const releaseAndVersion of releasesAndVersionsToPurge) {
                                                    if (
                                                        previousMajorVersion && areEqual(previousMajorVersion, releaseAndVersion.version)
                                                        || previousMinorVersion && areEqual(previousMinorVersion, releaseAndVersion.version)
                                                    ) {
                                                        console.log(`${releaseAndVersion.release.tag_name} (${releaseAndVersion.release.id}) was not purged (previous ${previousMajorVersion && areEqual(previousMajorVersion, releaseAndVersion.version) ? 'major' : 'minor'})`);
                                                        continue;
                                                    }
                                                    for (const asset of releaseAndVersion.release.assets) {
                                                        request.delete({
                                                            url: `https://api.github.com/repos/amarcireau/origami/releases/assets/${asset.id}`,
                                                            auth: {
                                                                user: username,
                                                                pass: password,
                                                                sendImmediately: true,
                                                            },
                                                            headers: {'user-agent': 'origami'},
                                                            json: true,
                                                        }, (error, httpIncomingMessage, body) => {
                                                            if (error) {
                                                                console.error(
                                                                    `https://api.github.com/repos/amarcireau/origami/releases/assets/${asset.id}`,
                                                                    error
                                                                );
                                                                process.exit(1);
                                                            }
                                                            if (httpIncomingMessage.statusCode !== 204) {
                                                                console.error(
                                                                    `https://api.github.com/repos/amarcireau/origami/releases/assets/${asset.id}`,
                                                                    body
                                                                );
                                                                process.exit(1);
                                                            }
                                                            console.log(`${asset.name} of ${releaseAndVersion.release.tag_name} (${asset.id} of ${releaseAndVersion.release.id}) deleted (expired version)`);
                                                        });

                                                    }
                                                }
                                            });
                                        }
                                    });
                                });
                            });
                            const archive = archiver('zip', {
                                zlib: {level: zlib.constants.Z_BEST_COMPRESSION},
                            });
                            archive.on('error', error => {
                                throw error;
                            });
                            archive.pipe(output);
                            if (matchedConfiguration[1] === 'darwin' || matchedConfiguration[1] === 'mas') {

                                // resolve Framework symlinks manually before zipping
                                try {
                                    fs.mkdirSync(`${path.dirname(__dirname)}/build/archives`);
                                } catch (error) {}
                                child_process.execSync(`rm -rf '${path.dirname(__dirname)}/build/archives/${directoryToZip}'`);
                                fs.mkdirSync(`${path.dirname(__dirname)}/build/archives/${directoryToZip}`);
                                child_process.execSync(`cp -R '${path.dirname(__dirname)}/build/${directoryToZip}/Origami.app' '${path.dirname(__dirname)}/build/archives/${directoryToZip}/Origami.app'`);
                                const frameworks = `${path.dirname(__dirname)}/build/archives/${directoryToZip}/Origami.app/Contents/Frameworks`;
                                for (const frameworkFile of fs.readdirSync(frameworks)) {
                                    if (path.extname(frameworkFile) === '.framework') {
                                        const framework = `${frameworks}/${frameworkFile}`;
                                        for (const element of fs.readdirSync(framework)) {
                                            if (element !== 'Versions') {
                                                child_process.execSync(`rm -rf '${framework}/${element}'`);
                                                child_process.execSync(`cp -R '${framework}/Versions/A/${element}' '${framework}/${element}'`);
                                            }
                                        }
                                        child_process.execSync(`rm -rf '${framework}/Versions'`);
                                    }
                                }

                                archive.directory(`${path.dirname(__dirname)}/build/archives/${directoryToZip}/Origami.app`, 'Origami.app');
                                archive.finalize();
                            } else {
                                archive.directory(`${path.dirname(__dirname)}/build/${directoryToZip}`, 'Origami');
                                archive.finalize();
                            }
                        }
                    }
                }
            });
        });
    });
    process.stdout.write('password: ');
});
