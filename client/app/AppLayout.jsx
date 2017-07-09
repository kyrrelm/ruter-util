import React from 'react';
import { Route, Redirect, Switch} from 'react-router-dom';
import CardPage from './page/CardPage.jsx';
import SetupPage from './page/SetupPage.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="content">
          <Switch>
            <Route path="/stop/:stopId" component={CardPage}/>
            <Route exact path="/setup" component={SetupPage} />
            <Redirect from="/" to="/setup"/>
          </Switch>
        </div>
      </div>
    );
  }
}
