// hack for windows
process.env.NODE_ENV = process.env.NODE_ENV.trim();

var webpack = require('webpack');
var __STATIC_ASSETS_CDN__ = 'http://eternitycast.com';
if (process.env.NODE_ENV === 'development') {
	__STATIC_ASSETS_CDN__ = 'http://localhost:8080';
}

module.exports = {
	devtool: 'source-map',
	entry: {
		bundle: './src/client/admin'
	},
	output: {
		path: __dirname + '/build/www',
		publicPath: '/',
		filename: 'admin-app.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx'],
	},
	plugins: [
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
			__webpack_public_path__: JSON.stringify(__STATIC_ASSETS_CDN__ + '/'),
			__SERVER__: false,
		})
	],
	module: {
		loaders: [{
			test: /\.s?css$/,
			loaders: ['style', 'css', 'sass?sourceMap']
		}, {
			test: /\.styl$/,
			loaders: ['style', 'css', 'stylus']
		}, {
			test: /\.(gif|png|jpe?g|svg)$/,
			loaders: ['url?limit=1']
		}, {
			test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: "url-loader?limit=1&minetype=application/font-woff"
		}, {
			test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
			loader: "url-loader?limit=1"
		}, {

			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader: 'babel',
			query: {
				babelrc: false,
				presets: ['es2015', 'react', 'stage-0'],
				plugins: ["transform-async-to-generator", "transform-decorators-legacy"]
			}
		}]
	}
};
