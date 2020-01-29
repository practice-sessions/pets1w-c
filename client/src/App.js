import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Categories from '../src/categories/Categories';
import ShowEvents from '../src/components/events/ShowEvents';
import RegUserClient from './components/users/auth/authUserForms/RegUserClient';
import LoginUserClient from './components/users/auth/authUserForms/LoginUserClient'; 
import Alerts from '../src/components/navbar/Alerts';
import PrivateRoute from '../src/components/routing/PrivateRoute';
import ShowNotFound from '../src/components/events/ShowNotFound'; 

import OwnBioState from './context/ownbio/OwnBioState';
import AuthState from './context/auth/AuthState';
import PetState from './context/pet/PetState';
import AlertState from './context/alert/AlertState';
import setAuthToken from '../src/utils/setAuthToken';
import './App.css';

// To get token from local storage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

const App = () => {

  return (
    <AuthState>
      <OwnBioState>
        <PetState>
          <AlertState>
            <Router>
              <Fragment>
                <Categories>
                  <div className="container">
                    <Alerts />
                    <Switch>
                      <PrivateRoute exact path='/welcome' component={ShowEvents} />
                      <Route exact path='/register' component={RegUserClient} />
                      <Route exact path='/get-client' component={LoginUserClient} />
                      <Route component={ShowNotFound} />
                    </Switch>
                  </div>
                </Categories>
              </Fragment>
            </Router>
          </AlertState>
        </PetState>
      </OwnBioState>
    </AuthState>
  );
}
export default App;
