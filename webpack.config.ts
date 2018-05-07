import { AngularCompilerPlugin } from "@ngtools/webpack";
import * as DeclarationBundlerPlugin from "declaration-bundler-webpack-plugin";
import * as ExtractTextPlugin from "extract-text-webpack-plugin";
import * as HtmlWebpackPlugin from "html-webpack-plugin";
import * as InlineManifestWebpackPlugin from "inline-manifest-webpack-plugin";
import * as path from "path";
import * as webpack from "webpack";
import * as CleanObsoleteChunks from "webpack-clean-obsolete-chunks";
import * as nodeExternals from "webpack-node-externals";

const extractMainCssPlugin = new ExtractTextPlugin("main.[contenthash:20].css");

export default {
  entry: [
    "./src/app/main/main.ts",
    "./src/app/main/main.scss"
  ],
  target: "web",
  output: {
    path: resolve("dist/assets"),
    filename: "[name].[chunkhash].js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      {
        test: /(?:\.ngfactory\.js|\.ngstyle\.js|\.ts)$/,
        loader: "@ngtools/webpack"
      },
      {
        test: /\.html$/,
        oneOf: [
          {
            test: /src\/app\/main\/main.html$/,
            loader: ["extract-loader", "html-loader", "ejs-loader"]
          },
          { loader: "html-loader" }
        ]
      },
      {
        test: /\.css$/,
        loader: cssLoader()
      },
      {
        test: /\.scss$/,
        oneOf: [
          {
            test: /src\/app\/main\/main.scss$/,
            loader: extractMainCssPlugin.extract(scssLoader())
          },
          { loader: scssLoader() }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|eot|woff|woff2|ttf|svg)(\?.*)?$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[hash:20].[ext]"
          }
        }
      }
    ]
  },
  plugins: [
    extractMainCssPlugin,
    new webpack.optimize.CommonsChunkPlugin({
      name: "vendor",
      minChunks: (module, count) => {
        return (/node_modules/).test(module.resource);
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "manifest",
      minChunks: Infinity
    }),
    new AngularCompilerPlugin({
      tsConfigPath: "src/app/tsconfig.json",
      entryModule: "src/app/app.module#AppModule",
      sourceMap: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
    }),
    new InlineManifestWebpackPlugin({
      name: "webpackManifest"
    }),
    new HtmlWebpackPlugin({
      template: "src/app/main/main.html"
    }),
    new CleanObsoleteChunks(),
    new webpack.NoEmitOnErrorsPlugin()
  ]
};

// export const lib = {
//   entry: "./src/s3flags-ui.ts",
//   target: "node",
//   output: {
//     path: resolve("dist"),
//     filename: "s3flags-ui.js"
//   },
//   resolve: {
//     extensions: [".ts", ".js"]
//   },
//   externals: nodeExternals(),
//   module: {
//     rules: [
//       {
//         test: /\.ts$/,
//         loader: "ts-loader",
//         // options: { logLevel: "warn" }
//       }
//     ]
//   },
//   plugins: [
//     new DeclarationBundlerPlugin({
//       moduleName: "some.path.moduleName",
//       out: resolve("dist/s3flags-ui.d.ts"),
//     }),
//     new webpack.NoEmitOnErrorsPlugin()
//   ]
// };

////////////

function resolve(...paths: string[]): string {
  return path.resolve(__dirname, ...paths);
}

function cssLoader() {
  return [
    { loader: "to-string-loader" },
    {
      loader: "css-loader",
      options: { minimize: true }
    }
  ];
}

function scssLoader() {
  return cssLoader().concat({ loader: "sass-loader" });
}
