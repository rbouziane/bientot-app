module.exports = {
  root: true,
  extends: ['@react-native', 'plugin:prettier/recommended'],
  rules: {
    // Conflict with the project rule "never destructure props" (cf.
    // docs/components.md). Listing `props.x` in the deps array is enough
    // in practice and the rule has no option to accept it without
    // destructuring, so it is disabled.
    'react-hooks/exhaustive-deps': 'off',
    // The project explicitly allows inline styles for dynamic values on
    // native RN components (cf. docs/components.md → "Styles inline pour
    // valeurs dynamiques"). The rule flags every inline style indiscriminately,
    // so it stays off.
    'react-native/no-inline-styles': 'off',
  },
};
