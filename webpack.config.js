const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const { withAlias } = require('@expo/webpack-config/addons');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = async function (env, argv) {
  let config = await createExpoWebpackConfigAsync(env, argv);
  config = withAlias(config, {
    'react-native$': 'react-native-web',
    'react-native-webview': 'react-native-web-webview',
    'react-native-linear-gradient':
      'react-native-web-linear-gradient',
  });

  // Use the React refresh plugin in development mode
  if (env.mode === 'development') {
    config.plugins.push(new ReactRefreshWebpackPlugin());
  }

  return config;
};
