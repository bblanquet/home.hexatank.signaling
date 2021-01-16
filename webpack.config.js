const path = require('path');
var nodeExternals = require('webpack-node-externals');

module.exports = (env) => {
	// Entry point : first executed file
	// This may be an array. It will result in many output files.
	return {
        target: 'node',
        externals: [nodeExternals()],
		entry: [ './src/index.ts' ],
		stats: {
			errorDetails: true // --display-error-details
		},
		// Make errors mor clear
		devtool: 'inline-source-map',
		// Configure output folder and file
		output: {
			path: path.resolve(__dirname, 'dist'),
            filename: 'main.js',
            publicPath: '/'
		},

		// What files webpack will manage
		resolve: {
			extensions: [ '.ts' ]
		},
		module: {
            rules: [
                {
                  test: /\.ts$/,
                  use: [
                    'ts-loader',
                  ]
                }
              ]
		},
	};
};
