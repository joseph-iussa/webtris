var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

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
            })
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

    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".js"]
    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loaders: ['babel-loader']
            }
        ],

        preLoaders: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: "source-map-loader" }
        ]
    },

    plugins: getPlugins()
};