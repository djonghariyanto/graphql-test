const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");
const isProduction = process.env.NODE_ENV == "production";

const config = {
  target: "async-node",
  entry: "./src/index.ts",
  output: {
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [new NodemonPlugin()],
  module: {
    rules: [
      {
        test: /\.(graphql|gql)$/i,
        use: {
          loader: "@graphql-tools/webpack-loader",
        },
        exclude: ["/node_modules/"],
      },
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
