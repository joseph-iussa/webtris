var path = require("path");
var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require("clean-webpack-plugin");

const IN_PROD = process.env.NODE_ENV === "production";

function getPlugins() {
    var plugins = [
        new webpack.DefinePlugin({
            // Define NODE_ENV so that uglification will eliminate dev safety checks in React source in prod build.
            "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
        }),
        new HtmlWebpackPlugin({
            template: "index.html"
        })
    ];

    if (IN_PROD) {
        plugins = plugins.concat([
            new webpack.optimize.DedupePlugin(),
            new webpack.optimize.OccurrenceOrderPlugin(true),
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            }),
            new CleanWebpackPlugin(["dist"])
        ]);
    }

    return plugins;
}

module.exports = {
    entry: {
        game: [
            "babel-polyfill",
            "./src/game.js"
        ]
    },
    output: {
        path: "./dist",
        filename: "[name].bundle.js"
    },

    devtool: IN_PROD ? "" : "source-map",

    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".js"]
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "src"),
                loaders: ['babel-loader']
            }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "src"),
                loader: "source-map-loader"
            }
        ]
    },

    plugins: getPlugins()
};