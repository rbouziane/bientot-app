module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended'],
  rules: {
    // Conflict with the project rule "never destructure props" (cf.
    // docs/components.md). Listing `props.x` in the deps array is enough
    // in practice and the rule has no option to accept it without
    // destructuring, so it is disabled.
    'react-hooks/exhaustive-deps': 'off',
  },
};
