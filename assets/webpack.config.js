/**
 * Webpack configuration.
 */
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

// JS Directory path.
const JS_DIR = path.resolve(__dirname, "src/js");
const SASS_DIR = path.resolve(__dirname, "src/sass");
const IMG_DIR = path.resolve(__dirname, "src/img");
const LIB_JS_DIR = path.resolve(__dirname, "src/library/js");
const LIB_CSS_DIR = path.resolve(__dirname, "src/library/css");
const FONTS_DIR = path.resolve(__dirname, "src/library/fonts");
const BUILD_DIR = path.resolve(__dirname, "build");
const entry = {
    main: JS_DIR + "/main.js",
};
const output = {
    path: BUILD_DIR,
    filename: "js/[name].js",
    assetModuleFilename: "[path][name][ext]",
};
/**
 * Note: argv.mode will return 'development' or 'production'.
 */
const plugins = (argv) => [
    new CleanWebpackPlugin({
        cleanStaleWebpackAssets: argv.mode === "production", // Automatically remove all unused webpack assets on rebuild, when set to true in production. ( https://www.npmjs.com/package/clean-webpack-plugin#options-and-defaults-optional )
    }),
    new MiniCssExtractPlugin({
        filename: "css/[name].css",
    }),
];
const rules = [
    {
        test: /\.js$/i,
        include: [JS_DIR],
        exclude: /node_modules/,
        use: "babel-loader",
    },
    {
        test: /\.scss$/i,
        include: [SASS_DIR],
        exclude: /node_modules/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
    },
    {
        test: /\.(png|svg|jpg|jpeg|gif|ico)$/i,
        include: [IMG_DIR],
        type: "asset/resource",
        generator: {
            filename: "img/[name][ext]",
        },
    },
    {
        test: /\.(woff|woff2|eot|ttf|otf|svg)$/i,
        include: [FONTS_DIR],
        type: "asset/resource",
        generator: {
            filename: "library/fonts/[name][ext]",
        },
    },
    {
        test: /\.(js)$/i,
        include: [LIB_JS_DIR],
        type: "asset/resource",
        generator: {
            filename: "library/js/[name][ext]",
        },
    },
    {
        test: /\.(css)$/i,
        include: [LIB_CSS_DIR],
        type: "asset/resource",
        generator: {
            filename: "library/css/[name][ext]",
        },
    },
];
/**
 * Since you may have to disambiguate in your webpack.config.js between development and production builds,
 * you can export a function from your webpack configuration instead of exporting an object
 *
 * @param {string} env environment ( See the environment options CLI documentation for syntax examples. https://webpack.js.org/api/cli/#environment-options )
 * @param argv options map ( This describes the options passed to webpack, with keys such as output-filename and optimize-minimize )
 * @return {{output: *, devtool: string, entry: *, optimization: {minimizer: [*, *]}, plugins: *, module: {rules: *}, externals: {jquery: string}}}
 *
 * @see https://webpack.js.org/configuration/configuration-types/#exporting-a-function
 */
module.exports = (env, argv) => ({
    entry: entry,
    output: output,
    /**
     * A full SourceMap is emitted as a separate file ( e.g.  main.js.map )
     * It adds a reference comment to the bundle so development tools know where to find it.
     * set this to false if you don't need it
     */
    devtool: "source-map",
    module: {
        rules: rules,
    },
    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin({
                minify: [CssMinimizerPlugin.cssnanoMinify],
            }),
            new TerserPlugin({
                parallel: true,
            }),
        ],
    },
    plugins: plugins(argv),
    externals: {
        jquery: "jQuery",
    },
});
