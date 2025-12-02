module.exports = {
  expo: {
    name: 'Maigie',
    slug: 'maigie',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'maigie',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    web: {
      bundler: 'metro',
      favicon: './assets/images/favicon.png',
    },
    plugins: [
      'expo-router',
      [
        'expo-splash-screen',
        {
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          resizeMode: 'contain',
          backgroundColor: '#ffffff',
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // API Base URL - can be overridden by environment variables
      apiBaseUrl:
        process.env.EXPO_PUBLIC_API_BASE_URL ||
        process.env.API_BASE_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://api.maigie.com'
          : process.platform === 'android'
            ? 'http://10.0.2.2:8000'
            : 'http://localhost:8000'),
    },
  },
};

