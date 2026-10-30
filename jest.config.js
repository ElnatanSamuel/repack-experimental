module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(@callstack/repack|@react-native|react-native)/)',
  ],
};
