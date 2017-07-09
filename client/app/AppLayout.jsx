import React from 'react';
import { Route, Redirect, Switch} from 'react-router-dom';
import Departure from './page/DeparturesPage.jsx';
import SetupPage from './page/SetupPage.jsx';

export default class AppLayout extends React.Component {
  render() {
    return (
      <div className="container">
        <div className="content">
          <Switch>
            <Route path="/stop/:stopId" component={Departure}/>
            <Route exact path="/setup" component={SetupPage} />
            <Redirect from="/" to="/setup"/>
          </Switch>
        </div>
      </div>
    );
  }
}
