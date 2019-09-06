module.exports = {
  root: true,
  env: {
    commonjs: true,
    browser: true,
    node: true,
    es6: true
  },
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['node', 'import', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    //强制使用单引号
    quotes: ['error', 'single'],
    //强制不使用分号结尾
    semi: ['error', 'never'],
    // 'no-mixed-spaces-and-tabs': 0,
    eqeqeq: 0,
    complexity: ['error', { max: 30 }],
    'prefer-object-spread': 0
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  globals: {
    __VERSION__: true
  }
}
