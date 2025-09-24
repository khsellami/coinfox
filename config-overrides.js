const { override, addWebpackResolve, addWebpackPlugin } = require('customize-cra');
const webpack = require('webpack');

// Clean config-overrides: provide fallbacks for browser polyfills used by some dependencies.
// The previous file contained injected/obfuscated code. That content has been removed.
module.exports = override(
  addWebpackResolve({
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      assert: require.resolve('assert/'),
      stream: require.resolve('stream-browserify'),
      vm: require.resolve('vm-browserify')
    }
  }),
  addWebpackPlugin(
    new webpack.ProvidePlugin({
      process: 'process/browser'
    })
  )
);