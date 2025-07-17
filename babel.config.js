'use strict';

module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@emotion/babel-preset-css-prop'],
  plugins: [
    'react-hot-loader/babel',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-optional-chaining',
  ],
};
