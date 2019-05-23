const common = require(`${__dirname}/webpack.common`);
const path = require('path');
const PackagerWebpackPlugin = require(`${__dirname}/packager-webpack-plugin`);
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

module.exports = {
    ...common,
    mode: 'development',
    plugins: [
        new PackagerWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: `${path.dirname(__dirname)}/source/index.ejs`,
            inlineSource: '\.js$',
            inject: true
        }),
        new HtmlWebpackInlineSourcePlugin(),
    ],
};
