const path = require('path');
const merge = require('webpack-merge');
const common = require(`${__dirname}/webpack.common`);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

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
                        common.package(false, callback);
                    }
                });
                callback();
            });
        },
        new HtmlWebpackPlugin({
            template: `${path.dirname(__dirname)}/source/index.ejs`,
            inlineSource: '\.js$',
            inject: true
        }),
        new HtmlWebpackInlineSourcePlugin(),
    ],
});
