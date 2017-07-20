/* eslint flowtype-errors/show-errors: 0 */
import React from 'react';
import { Switch, Route } from 'react-router';
import App from './containers/App';
import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';
import GalleryPage from './containers/GalleryPage';
import DemoPage from './containers/DemoPage';

export default () => (
  <App>
    <Switch>
      <Route path="/counter" component={CounterPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/demo" component={DemoPage} />
      <Route path="/" component={HomePage} />
    </Switch>
  </App>
);
