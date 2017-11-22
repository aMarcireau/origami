const fs = require('fs');
const webpack = require('webpack');
const child_process = require('child_process');
const packager = require('electron-packager')

module.exports = {

    /// package uses electron-packager to convert the output of webpack to actual apps.
    package: (all, callback) => {
        try {
            fs.mkdirSync(`${__dirname}/build/origami`);
        } catch (error) {}
        for (const sourceFileToCopy of ['main.js', 'package.json']) {
            fs.copyFileSync(`${__dirname}/source/${sourceFileToCopy}`, `${__dirname}/build/origami/${sourceFileToCopy}`);
        }
        fs.copyFileSync(`${__dirname}/themes/default.json`, `${__dirname}/build/origami/colors.json`);
        try {
            fs.mkdirSync(`${__dirname}/build/origami/fonts`);
        } catch (error) {}
        for (const fontFileToCopy of fs.readdirSync(`${__dirname}/fonts`)) {
            fs.copyFileSync(`${__dirname}/fonts/${fontFileToCopy}`, `${__dirname}/build/origami/fonts/${fontFileToCopy}`);
        }
        fs.copyFileSync(`${__dirname}/icons/origami.png`, `${__dirname}/build/origami/origami.png`);
        fs.copyFileSync(`${__dirname}/build/index.html`, `${__dirname}/build/origami/index.html`);
        child_process.execSync('npm install', {cwd: `${__dirname}/build/origami`}, {stdio: 'inherit'});
        packager({
            dir: `${__dirname}/build/origami`,
            all: all,
            out: `${__dirname}/build`,
            overwrite: true,
            icon: `${__dirname}/icons/origami`,
            download: {
                cache: `${__dirname}/build/cache`,
            },
        }, (error, appPaths) => {
            if (error) {
                console.error(error);
            } else {
                console.log(appPaths.map(appPath => `Created ${appPath}`).join('\n'));
            }
            if (callback) {
                callback();
            }
        });
    },

    /// configuration defines common webpack parameters for dev and prod.
    configuration: {
        target: 'electron-renderer',
        entry: './source/app.js',
        output: {
            path: `${__dirname}/build`,
            filename: 'index.js',
        },
        module: {
            loaders: [
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /node_modules/,
                    query: {
                        presets: [
                            ['env', {'targets': {'electron': '1.7.6', 'browsers': 'last 2 versions'}}],
                            'react',
                        ],
                        plugins: [
                            'babel-plugin-transform-class-properties',
                            'babel-plugin-transform-object-rest-spread',
                        ],
                    },
                },
            ],
        },
        resolve: {
            modules: ['node_modules'],
        },
    },
};
