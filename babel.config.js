module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '~': './app',
          '~api': './app/api',
          '~features': './app/features',
          '~navigators': './app/navigators',
          '~shared': './app/shared',
          '~i18n': './app/i18n',
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
