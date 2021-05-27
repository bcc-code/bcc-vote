const path = require("path")

module.exports = {
    devServer: {
        port: 8080,
        historyApiFallback: {
            rewrites: [{ from: /./, to: path.posix.join("/", "index.html") }]
        }
    },
    publicPath: "/",
    outputDir: "../server/public",
    runtimeCompiler: true,    
    lintOnSave: false,
    chainWebpack: config => {
        config.plugin("copy").tap(([options]) => {
            options[0].ignore.push("**/config.json");
            return [options]
        })
    },
    configureWebpack: () => {
        if(process.env.NODE_ENV === 'production') {
            const settings = {
                mode: 'production',
                devtool: 'source-map',
                optimization: {
                    minimize: true,
                    usedExports: true
                }
            }
            return settings
        }
    }
}
