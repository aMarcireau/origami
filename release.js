const request = require('request');
const readline = require('readline');
const stream = require('stream');
const fs = require('fs');
const archiver = require('archiver');
const zlib = require('zlib');
const urlTemplate = require('url-template');

const syntax = 'Syntax: node release.js v<major>.<minor>.<patch> [--prerelease]';

if (process.argv.length !== 3 && process.argv.length !== 4) {
    console.error(`Unexpected number of arguments. ${syntax}`);
    process.exit(1);
}

let prerelease;
let version;
if (process.argv.length === 3) {
    prerelease = false;
    version = process.argv[2];
} else {
    if (process.argv[2] === '--prerelease') {
        prerelease = true;
        version = process.argv[3];
    } else if (process.argv[3] === '--prerelease') {
        prerelease = true;
        version = process.argv[2];
    } else {
        console.error(`Two arguments were provided, but none is '--prerelease'. ${syntax}`);
        process.exit(1);
    }
}

const matchedVersion = /^v([1-9]\d*|\d)\.([1-9]\d*|\d)\.([1-9]\d*|\d)$/.exec(version);
if (matchedVersion == null) {
    console.error(`Unexpected version format. ${syntax}`);
    process.exit(1);
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
            url: `https://api.github.com/repos/amarcireau/origami/releases`,
            auth: {
                user: username,
                pass: password,
                sendImmediately: true,
            },
            headers: {'user-agent': 'origami'},
            json: {
                tag_name: `${version}${prerelease ? '-alpha' : ''}`,
                draft: true,
                prerelease: prerelease,
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
                                archive.directory(`${__dirname}/build/${directoryToZip}/Origami.app`, 'Origami.app');
                            } else {
                                archive.directory(`${__dirname}/build/${directoryToZip}`, 'Origami');
                            }
                            archive.finalize();
                        }
                    }
                }
            });
        });
    });
    process.stdout.write('password: ');
});
