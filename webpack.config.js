const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;

module.exports = {
    mode: "none",
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "build.min.js",
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            structures: path.resolve("./src/structures"),
            objects: path.resolve("./src/objects"),
            core: path.resolve('./src/core'),
        },
    },
    // TODO: disable when production build is enabled
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.ts$/,
                loader: 'ts-loader',
            },
        ],
    },
    devServer: {
        historyApiFallback: true,
        static: [
            {
                directory: path.resolve(__dirname),
                watch: true,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            verbose: true,
        }),
    ],
};
