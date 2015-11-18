import React from 'react';
import Helmet from "react-helmet";
import MyStoriesList from '../components/MyStoriesList'

let MyStories = React.createClass({
  
  render() {
    return (
      <div>
        <Helmet title="My stories"/>

        <MyStoriesList />        
        
      </div>
    )
  },
});

export default MyStories;