module.exports = {
  expo: {
    name: 'blinddate',
    slug: 'blinddate',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.blinddate'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.anonymous.blinddate'
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/favicon.png'
    },
    plugins: [
      'expo-router'
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      firebaseConfig: {
        apiKey: "AIzaSyD8Ov5xsD_qDZUjV6gcfBs0IG9d5d8TCBE",
        authDomain: "livelinkme-app.firebaseapp.com",
        projectId: "livelinkme-app",
        storageBucket: "livelinkme-app.firebasestorage.app",
        messagingSenderId: "848262898852",
        appId: "1:848262898852:web:013e764310578d0603b231",
        measurementId: "G-7NQ8SM558E"
      }
    }
  }
}; 