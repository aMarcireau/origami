const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const child_process = require('child_process');
const packager = require('electron-packager');
const recursive = require(`${__dirname}/recursive`);

module.exports = {

    /// package uses electron-packager to convert the output of webpack to actual apps.
    package: (production, callback) => {
        console.log('\nCopying the package assets');
        try {
            fs.mkdirSync(`${path.dirname(__dirname)}/build/origami`);
        } catch (error) {}
        fs.copyFileSync(`${path.dirname(__dirname)}/source/package.json`, `${path.dirname(__dirname)}/build/origami/package.json`);
        fs.writeFileSync(`${path.dirname(__dirname)}/build/origami/main.js`, `process.env.ORIGAMI_ENV = '${production ? 'production' : 'development'}';\n`);
        fs.appendFileSync(`${path.dirname(__dirname)}/build/origami/main.js`, fs.readFileSync(`${path.dirname(__dirname)}/source/main.js`));
        fs.copyFileSync(`${path.dirname(__dirname)}/themes/default.json`, `${path.dirname(__dirname)}/build/origami/colors.json`);
        try {
            fs.mkdirSync(`${path.dirname(__dirname)}/build/origami/fonts`);
        } catch (error) {}
        recursive.copyFileSync(`${path.dirname(__dirname)}/fonts`, `${path.dirname(__dirname)}/build/origami/fonts`);
        fs.copyFileSync(`${path.dirname(__dirname)}/icons/origami.png`, `${path.dirname(__dirname)}/build/origami/origami.png`);
        fs.copyFileSync(`${path.dirname(__dirname)}/build/index.html`, `${path.dirname(__dirname)}/build/origami/index.html`);
        child_process.execSync('npm install', {cwd: `${path.dirname(__dirname)}/build/origami`}, {stdio: 'inherit'});
        packager({
            dir: `${path.dirname(__dirname)}/build/origami`,
            all: production,
            out: `${path.dirname(__dirname)}/build`,
            overwrite: true,
            icon: `${path.dirname(__dirname)}/icons/origami`,
            download: {
                cache: `${path.dirname(__dirname)}/build/cache`,
            },
        }, (error, appPaths) => {
            if (error) {
                console.error(error);
            } else {
                console.log(appPaths.map(appPath => `Created ${appPath}`).join('\n'));
            }
            callback();
        });
    },

    /// configuration defines common webpack parameters for dev and prod.
    configuration: {
        target: 'electron-renderer',
        entry: `${path.dirname(__dirname)}/source/app.js`,
        output: {
            path: `${path.dirname(__dirname)}/build`,
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
                            ['env', {targets: {electron: '1.7.6'}}],
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
            modules: [`${path.dirname(__dirname)}/node_modules`],
        },
    },
};
