import React from 'react';
import Helmet from "react-helmet";
import ApiClient from '../ApiClient'

let WritePage = React.createClass({

  getInitialState(){
    return {
      user: null
    }
  },

  render() {
    return (
    	<div className="container">
        write
      </div>
  	)
  }

});

export default WritePage