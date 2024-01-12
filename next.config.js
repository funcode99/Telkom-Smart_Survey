const { i18n } = require("./next-i18next.config");

module.exports = {
    images: {
        domains: ['storage.googleapis.com', 'api.veritrans.co.id'],
    },
    webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
            config.plugins.push(
                new webpack.IgnorePlugin({
                    resourceRegExp: /^\.\/locale$/,
                    contextRegExp: /moment$/,
                })
            );
        }
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ['@svgr/webpack'],
        })

        return config;
    },
    i18n,
};
