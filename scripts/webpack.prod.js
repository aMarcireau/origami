const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require(`${__dirname}/webpack.common`);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = merge(common.configuration, {
    plugins: [
        function() {
            this.plugin('before-run', (compiler, callback) => {
                compiler.plugin('after-emit', (compilation, callback) => {
                    common.package(true, callback);
                });

                callback();
            });
        },
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production'),
        }),
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
