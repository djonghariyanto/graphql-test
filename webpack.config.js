const NodemonPlugin = require("nodemon-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");

const path = require("path");
const isProduction = process.env.NODE_ENV == "production";

const config = {
  target: "async-node",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new NodemonPlugin(),
    new CopyPlugin({
      patterns: [{ from: "./src/*.gql", to: "./gql/[name][ext]" }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
