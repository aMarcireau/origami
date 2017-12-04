const request = require('request');
const readline = require('readline');
const stream = require('stream');
const fs = require('fs');
const archiver = require('archiver');
const zlib = require('zlib');
const urlTemplate = require('url-template');
const recursive = require(`${__dirname}/recursive`);
const path = require('path');

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

const versionAsString = JSON.parse(fs.readFileSync(`${__dirname}/source/package.json`)).version;
const semverMatch = semver.exec(`v${versionAsString}`);
if (!semverMatch) {
    console.error('The version number does not have the expected format');
    process.exit(1);
}
const version = {
    major: semverMatch[1],
    minor: semverMatch[2],
    patch: semverMatch[3],
    identifier: semverMatch[4] ? semverMatch[4] : null,
};

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
                    fs.mkdirSync(`${__dirname}/build/archives`);
                } catch (error) {}
                let directoriesLeft = 0;
                for (const directoryToZip of fs.readdirSync(`${__dirname}/build`)) {
                    if (fs.lstatSync(`${__dirname}/build/${directoryToZip}`).isDirectory()) {
                        const matchedConfiguration = /^Origami-([^-]+)-([^-]+)$/.exec(directoryToZip);
                        if (matchedConfiguration != null) {
                            ++directoriesLeft;
                            const output = fs.createWriteStream(`${__dirname}/build/archives/${directoryToZip}.zip`);
                            output.on('close', () => {
                                console.log(`Created '${__dirname}/build/archives/${directoryToZip}.zip'`);
                                fs.readFile(`${__dirname}/build/archives/${directoryToZip}.zip`, (error, archive) => {
                                    if (error) {
                                        console.error(`${__dirname}/build/archives/${directoryToZip}.zip`, error);
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
                                                                major: releaseSemverMatch[1],
                                                                minor: releaseSemverMatch[2],
                                                                patch: releaseSemverMatch[3],
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
                                                            } else if (release.assets.length > 0) {
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
                                                            releaseAndVersion.version.major === releaseAndVersion.major
                                                            && releaseAndVersion.version.minor === releaseAndVersion.minor
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
                                                for (const releaseAndVersion of releasesAndVersionsToPurge) {
                                                    if (
                                                        previousMajorVersion && areEqual(previousMajorVersion, releaseAndVersion.version)
                                                        || previousMinorVersion && areEqual(previousMinorVersion, releaseAndVersion.version)
                                                    ) {
                                                        console.log(`${releaseAndVersion.release.tag_name} (${releaseAndVersion.release.id}) was not purged (previous ${areEqual(previousMajorVersion, releaseAndVersion.version) ? 'major' : 'minor'})`);
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
                                    recursive.rmSync(`${__dirname}/build/archives/${directoryToZip}`);
                                    fs.mkdirSync(`${__dirname}/build/archives`);
                                } catch (error) {}
                                try {
                                    fs.mkdirSync(`${__dirname}/build/archives/${directoryToZip}`);
                                } catch (error) {}
                                recursive.copyFileSync(
                                    `${__dirname}/build/${directoryToZip}/Origami.app`,
                                    `${__dirname}/build/archives/${directoryToZip}/Origami.app`
                                );
                                const frameworks = `${__dirname}/build/archives/${directoryToZip}/Origami.app/Contents/Frameworks`;
                                for (const frameworkFile of fs.readdirSync(frameworks)) {
                                    if (path.extname(frameworkFile) === '.framework') {
                                        const framework = `${frameworks}/${frameworkFile}`;
                                        for (const element of fs.readdirSync(framework)) {
                                            if (element !== 'Versions') {
                                                recursive.rmSync(`${framework}/${element}`);
                                                recursive.copyFileSync(`${framework}/Versions/A/${element}`, `${framework}/${element}`);
                                            }
                                        }
                                        recursive.rmSync(`${framework}/Versions`);
                                    }
                                }

                                archive.directory(`${__dirname}/build/archives/${directoryToZip}/Origami.app`, 'Origami.app');
                                archive.finalize();
                            } else {
                                archive.directory(`${__dirname}/build/${directoryToZip}`, 'Origami');
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
