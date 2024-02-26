module.exports = function (api) {
  api.cache(true);
  const isTestEnv = process.env.NODE_ENV === 'test';
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            // This needs to be mirrored in tsconfig.json
            '@': './src',
            lib: './src/lib',
            platform: './src/platform',
            state: './src/state',
            view: './src/view',
          },
        },
        'react-native-reanimated/plugin',
      ],
    ],
  };
};
