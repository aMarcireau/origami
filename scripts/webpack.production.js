const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require(`${__dirname}/webpack.common`);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const uglifyEs = require('uglify-es');
const webpackSources = require('webpack-sources');

module.exports = {
    ...common,
    mode: 'production',
    plugins: [
        function() {
            this.plugin('before-run', (compiler, callback) => {
                compiler.plugin('after-compile', (compilation, callback) => {
                    for (const filename in compilation.assets) {
                        if (path.extname(filename) === '.js') {
                            console.log(`\nUglyfying ${filename}`);
                            const result = uglifyEs.minify(compilation.assets[filename].source());
                            if (result.error) {
                                throw result.error;
                            }
                            compilation.assets[filename] = new webpackSources.RawSource(result.code);
                        }
                    }
                    callback();
                });
                compiler.plugin('after-emit', (compilation, callback) => {
                    common.package(true, callback);
                });
                callback();
            });
        },
        new HtmlWebpackPlugin({
            template: `${path.dirname(__dirname)}/source/index.ejs`,
            inlineSource: '\.js$',
            inject: true,
            minify: {
                collapseWhitespace: true,
                minifyCSS: true,
                minifyJS: true,
                removeComments: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
            },
        }),
        new HtmlWebpackInlineSourcePlugin(),
    ],
});
