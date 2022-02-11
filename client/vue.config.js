const path = require("path");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");


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
    lintOnSave: true,
    chainWebpack: config => {
        config.plugin("copy").tap(([options]) => {
            options[0].ignore.push("**/config.json");
            return [options];
        });
        config.plugin('SentryWebpackPlugin').use(SentryWebpackPlugin, [{
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: "bcc-hj",
            project: "bcc-vote",
    
            // other SentryWebpackPlugin configuration
            include: ".",
            ignore: ["node_modules", "webpack.config.js"],
        }]);
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
            };
            return settings;
        }
    }
};
