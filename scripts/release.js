const axios = require("axios");
const child_process = require("child_process");
const fs = require("fs");
const path = require("path");
const readline = require("readline");
const stream = require("stream");
const archiver = require("archiver");
const zlib = require("zlib");
const urlTemplate = require("url-template");

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
        firstVersion.major === secondVersion.major &&
        firstVersion.minor === secondVersion.minor &&
        firstVersion.patch === secondVersion.patch
    );
}

const semver =
    /^v([1-9]\d*|0)\.([1-9]\d*|0)\.([1-9]\d*|0)(?:-([0-9A-Za-z-\.]+)$|$)/;

const versionAsString = JSON.parse(
    fs.readFileSync(`${path.dirname(__dirname)}/source/package.json`)
).version;
const semverMatch = semver.exec(`v${versionAsString}`);
if (!semverMatch) {
    console.error("The version number does not have the expected format");
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
    const readme = fs
        .readFileSync(`${path.dirname(__dirname)}/README.md`)
        .toString("utf8");
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
            const lines = readme
                .substring(0, simpleSemverMatch.index)
                .split("\n");
            let position = simpleSemverMatch.index;
            for (const line of lines.slice(0, lines.length - 1)) {
                position -= line.length + 1;
            }
            console.error(
                `Bad version number in README.md on line ${lines.length}:${
                    position + 1
                }`
            );
            process.exit(1);
        }
    }
}

(async () => {
    const auth = JSON.parse(
        fs.readFileSync(path.join(path.dirname(__dirname), "auth.json"))
    );
    auth.password = auth.token;
    delete auth.token;
    const release = (
        await axios.post(
            "https://api.github.com/repos/amarcireau/origami/releases",
            {
                tag_name: `v${versionAsString}`,
                draft: true,
                prerelease: false,
            },
            { auth }
        )
    ).data;
    console.log(
        `Created the draft release v${versionAsString} (id: ${release.id})`
    );
    try {
        fs.mkdirSync(`${path.dirname(__dirname)}/build/archives`);
    } catch (_) {}
    await Promise.all(
        fs
            .readdirSync(`${path.dirname(__dirname)}/build`, {
                withFileTypes: true,
            })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => [
                dirent.name,
                /^Origami-([^-]+)-([^-]+)$/.exec(dirent.name),
            ])
            .filter(([_, match]) => match != null)
            .map(([name, match]) =>
                (async () => {
                    const outputFilename = `${path.dirname(
                        __dirname
                    )}/build/archives/${name}.zip`;
                    await new Promise((resolve, reject) => {
                        const output = fs.createWriteStream(outputFilename);
                        output.on("close", resolve);
                        const archive = archiver("zip", {
                            zlib: {
                                level: zlib.constants.Z_BEST_COMPRESSION,
                            },
                        });
                        archive.on("error", reject);
                        archive.pipe(output);
                        if (match[1] === "darwin" || match[1] === "mas") {
                            archive.directory(
                                `${path.dirname(
                                    __dirname
                                )}/build/${name}/Origami.app`,
                                "Origami.app"
                            );
                        } else {
                            archive.directory(
                                `${path.dirname(__dirname)}/build/${name}`,
                                "Origami"
                            );
                        }
                        archive.finalize();
                    });
                    console.log(`Created "${outputFilename}"`);
                    await axios({
                        url: urlTemplate.parse(release.upload_url).expand({
                            name: `${name}.zip`,
                        }),
                        method: "post",
                        auth,
                        maxContentLength: Infinity,
                        maxBodyLength: Infinity,
                        headers: {
                            "Content-Length": fs.statSync(outputFilename).size,
                            "Content-Type": "application/zip",
                        },
                        data: fs.createReadStream(outputFilename),
                    });
                    console.log(`Uploaded "${name}.zip"`);
                })()
            )
    );
    console.log(
        `Upload complete, visit ${release.html_url} to publish the release`
    );
    if (version.identifier == null) {
        const releasesToPurge = [];
        for (const otherRelease of (
            await axios.get(
                "https://api.github.com/repos/amarcireau/origami/releases",
                { auth }
            )
        ).data
            .filter(otherRelease => otherRelease.id !== release.id)
            .map(otherRelease => [
                otherRelease,
                semver.exec(otherRelease.tag_name),
            ])
            .filter(([_, semverMatch]) => semverMatch != null)
            .map(([otherRelease, semverMatch]) => ({
                ...otherRelease,
                version: {
                    major: parseInt(semverMatch[1]),
                    minor: parseInt(semverMatch[2]),
                    patch: parseInt(semverMatch[3]),
                    identifier: semverMatch[4] ? semverMatch[4] : null,
                },
            }))) {
            if (otherRelease.draft) {
                await axios.delete(
                    `https://api.github.com/repos/amarcireau/origami/releases/${otherRelease.id}`,
                    { auth }
                );
                console.log(
                    `draft version ${otherRelease.tag_name} (${otherRelease.id}) deleted`
                );
            } else if (otherRelease.version.identifier) {
                console.log(
                    `${otherRelease.tag_name} (${otherRelease.id}) has an identifier: skipping automatic operations`
                );
            } else if (
                isSmallerThan(version, otherRelease.version) ||
                areEqual(version, otherRelease.version)
            ) {
                console.log(
                    `${otherRelease.tag_name} (${otherRelease.id}) is greater than or identical to the current version: skipping automatic operations`
                );
            } else {
                releasesToPurge.push(otherRelease);
            }
        }
        let previousMajorVersion = null;
        let previousMinorVersion = null;
        for (const otherRelease of releasesToPurge) {
            if (
                otherRelease.version.major < version.major - 1 ||
                (otherRelease.version.major === version.major &&
                    otherRelease.version.minor < version.minor - 1) ||
                (otherRelease.version.major === version.major &&
                    otherRelease.version.minor === version.minor)
            ) {
                continue;
            }
            if (
                otherRelease.version.major === version.major - 1 &&
                (previousMajorVersion == null ||
                    isSmallerThan(previousMajorVersion, otherRelease.version))
            ) {
                previousMajorVersion = otherRelease.version;
                continue;
            }
            if (
                otherRelease.version.major === version.major &&
                otherRelease.version.minor === version.minor - 1 &&
                (previousMinorVersion == null ||
                    isSmallerThan(previousMinorVersion, otherRelease.version))
            ) {
                previousMinorVersion = otherRelease.version;
                continue;
            }
        }
        console.log(
            previousMajorVersion == null
                ? "There is no previous major version"
                : `Previous major version preserved: v${previousMajorVersion.major}.${previousMajorVersion.minor}.${previousMajorVersion.patch}`
        );
        console.log(
            previousMinorVersion == null
                ? "There is no previous minor version"
                : `Previous minor version preserved: v${previousMinorVersion.major}.${previousMinorVersion.minor}.${previousMinorVersion.patch}`
        );
        for (const otherRelease of releasesToPurge) {
            if (
                (previousMajorVersion &&
                    areEqual(previousMajorVersion, otherRelease.version)) ||
                (previousMinorVersion &&
                    areEqual(previousMinorVersion, otherRelease.version))
            ) {
                console.log(
                    `${otherRelease.tag_name} (${
                        otherRelease.id
                    }) was not purged (previous ${
                        previousMajorVersion &&
                        areEqual(previousMajorVersion, otherRelease.version)
                            ? "major"
                            : "minor"
                    })`
                );
                continue;
            }
            for (const asset of otherRelease.assets) {
                await axios.delete(
                    `https://api.github.com/repos/amarcireau/origami/releases/assets/${asset.id}`,
                    { auth }
                );
                console.log(
                    `${asset.name} of ${otherRelease.tag_name} (${asset.id} of ${otherRelease.id}) deleted (expired version)`
                );
            }
        }
    }
})();
