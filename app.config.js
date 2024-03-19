module.exports = function () {
  return {
    name: 'musicapp',
    slug: 'musicapp',
    scheme: 'musicapp',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/musicapp.svg',
    userInterfaceStyle: 'automatic',
    experiments: {
      tsconfigPaths: true,
    },
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    //assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/musicapp.png',
    },
    plugins: ['expo-localization'],
  };
};
