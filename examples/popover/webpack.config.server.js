var config = require('./webpack.config'),
		webpack = require('webpack');

module.exports = Object.assign({}, config, {

	entry: [
		'webpack/hot/only-dev-server'		
	].concat(config.entry),

  resolve: {
    extensions: ['', '.js', '.jsx', '.json', '.scss', '.css' ],
    moduleDirectories: [ 'lib', 'node_modules' ]
  },

	plugins: config.plugins.concat( [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin()
	] )
});
