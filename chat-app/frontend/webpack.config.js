const path = require('path');

module.exports = {
    entry: './public/js/auth.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public'),
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
