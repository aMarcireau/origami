const common = require(`${__dirname}/webpack.common`);
const path = require("path");
const PackagerWebpackPlugin = require(`${__dirname}/packager-webpack-plugin`);
const HtmlWebpackPlugin = require("html-webpack-plugin");
const InlineChunkHtmlPlugin = require("inline-chunk-html-plugin");

module.exports = {
    ...common,
    mode: "production",
    plugins: [
        new PackagerWebpackPlugin(true),
        new HtmlWebpackPlugin({
            template: `${path.dirname(__dirname)}/source/index.ejs`,
            inlineSource: ".js$",
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
        new InlineChunkHtmlPlugin(HtmlWebpackPlugin, [/.*/]),
    ],
};
