module.exports = {
    publicPath: 'ltapp',
    configureWebpack: {
        module: {
            rules: [{
                test: /\.rs$/,
                use: [{
                    loader: 'wasm-loader'
                },{
                    loader: 'rust-native-wasm-loader'
                }]
            }]
        }
    }
}