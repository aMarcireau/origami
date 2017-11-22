const fs = require('fs');
const path = require('path');

module.exports = {

    /// copyFile copies source (either a file or directory) to target (where target is the new filename, not the enclosing directory).
    /// If source is a directory, its contents are recursively copied.
    copyFileSync: (source, target) => {
        if (fs.lstatSync(source).isDirectory()) {
            try {
                fs.mkdirSync(target);
            } catch (error) {}
            for (const file of fs.readdirSync(source)) {
                module.exports.copyFileSync(path.join(source, file), path.join(target, file));
            }
        } else {
            fs.copyFileSync(source, target);
        }
    },

    /// rmSync deletes the given file or directory.
    /// If the given filename is a directory, its contents are recursively deleted.
    rmSync: filename => {
        if (fs.lstatSync(filename).isDirectory()) {
            for (const file of fs.readdirSync(filename)) {
                module.exports.rmSync(path.join(filename, file));
            }
            fs.rmdirSync(filename);
        } else {
            fs.unlinkSync(filename);
        }
    }
};
