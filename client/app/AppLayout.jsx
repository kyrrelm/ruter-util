import React from 'react';
import { Route, Redirect, Switch} from 'react-router-dom';
import CardPage from './CardPage.jsx';
import Help from './Help.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="content">
          <Switch>
            <Route path="/stop/:stopId" component={CardPage}/>
            <Route exact path="/help" component={Help} />
            <Redirect from="/" to="/help"/>
          </Switch>
        </div>
      </div>
    );
  }
}
