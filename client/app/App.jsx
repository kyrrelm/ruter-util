import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AppLayout from './AppLayout.jsx';

export default class App extends React.Component {
  render() {
    return (
      <Router>
        <Route path="/" component={AppLayout}/>
      </Router>
    );
  }
}
