import path from "path"
// import webpack from "webpack"


let isProduction = global.isProduction;
let devtool = isProduction ? null : "#source-map";


export default {

  entry: {
    // "webpack/hot/dev-server",
    // "webpack-hot-middleware/client",
    './docs/js/app': "./site/js/app.js",
    './docs/js/Flooper': "./lib/index.js",
    './dist/Flooper': "./lib/index.js", // library compiled
  },

  output: {
    path: path.join(__dirname),
    // publicPath: '/dist/js',
    filename: "[name].js"
  },

  devtool,

  resolve: {
    root: [
      path.join(__dirname, "node_modules")
    ],
    moduleDirectories: [
      "node_modules"
    ],
    extensions: ["", ".js", ".jsx", ".webpack.js", ".web.js"]
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader?optional[]=runtime&stage=0"
      }
    ]
  },

  plugins: [
    // new webpack.HotModuleReplacementPlugin()
  ]
};