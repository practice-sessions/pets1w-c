import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Categories from '../src/categories/Categories';
import ShowEvents from '../src/components/events/ShowEvents';
import './App.css';

const App = () => {
  return (
    <Router>
      <Fragment>
        <Categories>
          <div className="container">
            <Switch>
              <Route exact path='/welcome' component={ShowEvents} />
              {/* <Route exact path='/add-petbio' component={AddPetBioClient} /> */}
              {/*<Route exact path='/get-petbio' component={GetOwnerPetBio} />*/}
            </Switch>
          </div>
        </Categories>
      </Fragment>
    </Router>
  );
};

export default App;
