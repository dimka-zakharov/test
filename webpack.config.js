const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.jsx|.js?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                     presets: ['es2015', 'stage-0', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.(jpe?g|png|gif|svg|ttf|eot|woff)$/i,
                loader: "file-loader"
            },
	    { 
		test: /node_modules.+xterm.+\.map$/, 
		loader: 'ignore-loader' 
	    }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
        publicPath: ''
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            title: 'Portal Test',
            template: __dirname + '/public/index.html'
        })
     ],
    devtool: 'source-map',
    devServer: {
        proxy: {
            '/*': {
                target: 'http://localhost:8081',
                secure: false,
                changeOrigin: true,
                bypass: function (req, res, proxyOptions) {
                    return false;
                }
            }
        },
        inline: true,
        port: 30000
    }
};
