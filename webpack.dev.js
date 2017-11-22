const fs = require('fs');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

const watchers = ['main.js', 'package.json'].map(sourceFileToCopy => fs.watch(`${__dirname}/source/${sourceFileToCopy}`, () => {
    common.package(false);
}));

module.exports = merge(common.configuration, {
    plugins: [
        function() {
            this.packaged = false;
            this.plugin('watch-run', (watching, callback) => {
                this.packaged = false;
                watching.compiler.plugin('after-emit', (compilation, callback) => {
                    if (this.packaged) {
                        callback();
                    } else {
                        this.packaged = true;
                        common.package(false, () => {
                            callback();
                        });
                    }
                });
                callback();
            });
        },
        new HtmlWebpackPlugin({
            template: './source/index.ejs',
            inlineSource: '\.js$',
            inject: true
        }),
        new HtmlWebpackInlineSourcePlugin(),
    ],
});
