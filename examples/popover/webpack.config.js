var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: __dirname + '/../../',
	entry: './examples/popover/index.jsx',
  devtool: 'sourcemap',
	output: {
		path: './dist/popover/',
		filename: "app.js"
	},
	module: {
		loaders: [
			{ test: /\.jsx?$/, exclude: /node_modules/, loaders: ['babel']}
		]
	},
	plugins: [
		new HtmlWebpackPlugin()
	]
};