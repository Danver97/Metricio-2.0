import React from 'react';
import qs from 'query-string';

export default function withAllProps(Component) {
  return function (props) {
    return (
      <Component 
        history={props.history} 
        match={props.match} 
        location={props.location} 
        query={qs.parse(props.location.search)} 
        user={props.user} 
      />
    );
  };
}
