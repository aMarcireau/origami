const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = merge(common.configuration, {
    plugins: [
        function() {
            this.plugin('before-run', (compiler, callback) => {
                compiler.plugin('done', () => {
                    common.package(true);
                });
                callback();
            });
        },
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production'),
            },
        }),
        new HtmlWebpackPlugin({
            template: './source/index.ejs',
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
