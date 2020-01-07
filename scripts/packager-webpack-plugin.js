const child_process = require('child_process');
const fs = require('fs-extra');
const packager = require('electron-packager');
const path = require('path');
const uglifyEs = require('uglify-es');
const webpackSources = require('webpack-sources');

/// Packager uses electron-packager to convert the output of webpack to actual apps.
class PackageWebpackPlugin {
    constructor(production = false) {
        this.production = production;
    }
    apply(compiler) {
        if (this.production) {
            compiler.hooks.afterCompile.tapAsync('PackageWebpackPlugin', (compilation, callback) => {
                for (const filename in compilation.assets) {
                    if (path.extname(filename) === '.js') {
                        console.log(`\nUglify ${filename}`);
                        const result = uglifyEs.minify(compilation.assets[filename].source());
                        if (result.error) {
                            throw result.error;
                        }
                        compilation.assets[filename] = new webpackSources.RawSource(result.code);
                    }
                }
                callback();
            });
        }
        compiler.hooks.afterEmit.tapAsync('PackageWebpackPlugin', (compilation, callback) => {
            console.log('\nCopy the package assets');
            try {
                fs.mkdirSync(`${path.dirname(__dirname)}/build/origami`);
            } catch (error) {}
            fs.copyFileSync(`${path.dirname(__dirname)}/source/package.json`, `${path.dirname(__dirname)}/build/origami/package.json`);
            fs.writeFileSync(
                `${path.dirname(__dirname)}/build/origami/main.js`,
                `process.env.ORIGAMI_ENV = '${this.production ? 'production' : 'development'}';\n`
                    + fs.readFileSync(`${path.dirname(__dirname)}/source/main.js`));
            fs.copyFileSync(`${path.dirname(__dirname)}/themes/default.json`, `${path.dirname(__dirname)}/build/origami/colors.json`);
            try {
                fs.mkdirSync(`${path.dirname(__dirname)}/build/origami/fonts`);
            } catch (error) {}
            fs.copySync(`${path.dirname(__dirname)}/fonts`, `${path.dirname(__dirname)}/build/origami/fonts`);
            fs.copyFileSync(`${path.dirname(__dirname)}/icons/origami.png`, `${path.dirname(__dirname)}/build/origami/origami.png`);
            fs.copyFileSync(`${path.dirname(__dirname)}/build/index.html`, `${path.dirname(__dirname)}/build/origami/index.html`);
            console.log('Install the package modules');
            child_process.execSync('npm install', {cwd: `${path.dirname(__dirname)}/build/origami`}, {stdio: 'inherit'});
            packager({
                dir: `${path.dirname(__dirname)}/build/origami`,
                all: this.production,
                out: `${path.dirname(__dirname)}/build`,
                overwrite: true,
                icon: `${path.dirname(__dirname)}/icons/origami`,
                download: {
                    cache: `${path.dirname(__dirname)}/build/cache`,
                },
            }).then(appPaths => {
                console.log(appPaths.map(appPath => `Created ${appPath}`).join('\n'));
                callback();
            }).catch(error => {
                console.error(error);
                callback();
            });
        });
    }
}
module.exports = PackageWebpackPlugin;
