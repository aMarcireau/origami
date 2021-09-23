const path = require("path");

module.exports = {
    target: "electron-renderer",
    entry: `${path.dirname(__dirname)}/source/app.js`,
    output: {
        path: `${path.dirname(__dirname)}/build`,
        filename: "index.js",
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            [
                                "@babel/preset-env",
                                { targets: { electron: "5.0.1" } },
                            ],
                            "@babel/preset-react",
                        ],
                        plugins: [
                            "babel-plugin-transform-class-properties",
                            "@babel/plugin-proposal-object-rest-spread",
                        ],
                    },
                },
            },
        ],
    },
    resolve: {
        modules: [`${path.dirname(__dirname)}/node_modules`],
    },
};
