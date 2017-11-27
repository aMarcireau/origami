const request = require('request');
const readline = require('readline');
const stream = require('stream');
const fs = require('fs');
const archiver = require('archiver');
const zlib = require('zlib');
const urlTemplate = require('url-template');
const recursive = require(`${__dirname}/recursive`);
const path = require('path');

const version = JSON.parse(fs.readFileSync(`${__dirname}/source/package.json`)).version;

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
            url: `https://api.github.com/repos/amarcireau/origami/releases`,
            auth: {
                user: username,
                pass: password,
                sendImmediately: true,
            },
            headers: {'user-agent': 'origami'},
            json: {
                tag_name: `v${version}`,
                draft: true,
                prerelease: false,
            },
        }, (error, httpIncomingMessage, body) => {
            if (error) {
                console.error(error);
                process.exit(1);
            }
            if (httpIncomingMessage.statusCode !== 201) {
                console.error(body);
                process.exit(1);
            }
            console.log(`Created the release v${version} (id: ${body.id})`);
            request.get({
                url: `https://api.github.com/repos/amarcireau/origami/releases/${body.id}`,
                auth: {
                    user: username,
                    pass: password,
                    sendImmediately: true,
                },
                headers: {'user-agent': 'origami'},
                json: true,
            }, (error, httpIncomingMessage, body) => {
                if (error) {
                    console.error(error);
                    process.exit(1);
                }
                if (httpIncomingMessage.statusCode !== 200) {
                    console.error(body);
                    process.exit(1);
                }
                try {
                    fs.mkdirSync(`${__dirname}/build/archives`);
                } catch (error) {}
                for (const directoryToZip of fs.readdirSync(`${__dirname}/build`)) {
                    if (fs.lstatSync(`${__dirname}/build/${directoryToZip}`).isDirectory()) {
                        const matchedConfiguration = /^Origami-([^-]+)-([^-]+)$/.exec(directoryToZip);
                        if (matchedConfiguration != null) {
                            const output = fs.createWriteStream(`${__dirname}/build/archives/${directoryToZip}.zip`);
                            output.on('close', () => {
                                console.log(`Created '${__dirname}/build/archives/${directoryToZip}.zip'`);
                                fs.readFile(`${__dirname}/build/archives/${directoryToZip}.zip`, (error, archive) => {
                                    if (error) {
                                        console.error(error);
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
                                            console.error(error);
                                            process.exit(1);
                                        }
                                        if (httpIncomingMessage.statusCode !== 201) {
                                            console.error(body);
                                            process.exit(1);
                                        }
                                        console.log(`Uploaded '${directoryToZip}'`);
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
