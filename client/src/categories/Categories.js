import React, { Fragment, Component } from 'react';
import Navbar from '../components/navbar/Navbar';

class Categories extends Component {
  render () {
    return (
      <Fragment>
        <div className="container">
          <Navbar />
        </div>
        {this.props.children}
      </Fragment>
    )
  }
}

export default Categories;