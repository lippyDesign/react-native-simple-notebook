import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import Nav from '../components/Nav.jsx';
import CallNow from '../components/CallNow.jsx';

export default class BlogPage extends Component {
    
  render() {
      
      return (
        <div>
            <Nav active='blog'/>
            <CallNow/>
            Blog
        </div>
      );
  }
}