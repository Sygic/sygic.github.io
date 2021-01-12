const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    plugins: [
        new HtmlWebPackPlugin({
            
            template: './src/app/mygeotabSygicPage.html',
                        
            filename: './mygeotabSygicPage.html'
        }),
        new MiniCssExtractPlugin({
            name: '[name].css',
            chunkFilename: '[id].css'
        }),
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'mygeotabSygicPage.js'
    }
}