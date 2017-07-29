import React from 'react';
import ReactDOM from 'react-dom';
import Root from './containers/DemoPage';
import './app.global.css';

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./containers/DemoPage', () => {
    const NextRoot = require('./containers/DemoPage'); // eslint-disable-line global-require
    ReactDOM.render(
      <NextRoot />,
      document.getElementById('root')
    );
  });
}
