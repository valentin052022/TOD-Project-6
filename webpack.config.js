const path = require("path");
const htmlWepackPlugin = require("html-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: "./src/app.js",
    output: {
        path: path.join(__dirname + "/dist"),
        filename: "bundle.js"
    },
    // html configuration
    plugins: [
        new htmlWepackPlugin({
            template: "src/index.html"
        })
    ],
    // css configuration
    module: {
        rules: [
            {
                test: /\.css/,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            }
        ]
    }
}
