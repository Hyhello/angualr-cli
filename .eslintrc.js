// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],
  // add your custom rules here
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'indent': 0,
    'eol-last': 0,
    'no-tabs': 0,
    "one-var": 0,
    "no-mixed-spaces-and-tabs": 0,
    "semi": ["error", "always"],
    "no-useless-return": 0,
    'standard/no-callback-literal': 0,
    "no-multi-spaces": ["error", { ignoreEOLComments: true }]
  }
}
