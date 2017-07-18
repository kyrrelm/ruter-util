import React from 'react';
import { HashRouter, Route } from 'react-router-dom';

import AppLayout from './AppLayout.jsx';

export default class App extends React.Component {
  render() {
    return (
      <HashRouter basename="/">
        <Route path="/" component={AppLayout}/>
      </HashRouter>
    );
  }
}
