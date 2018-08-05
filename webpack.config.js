const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/bundle.js'
    },
    mode: 'development',

    plugins : [new HtmlWebpackPlugin({
        filename : 'index.html',
        template : './src/index.html'
    })],

    devServer: {
        contentBase : './dist'
    }
};