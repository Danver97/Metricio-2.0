import React from 'react';
import ReactDOM from 'react-dom';

//import '../styles/default.scss';
import '../styles/login.scss';

ReactDOM.render(
  <div className="formlogin">
    <form action="/users/login" method="POST">
      <div className="line">
        <div className="label">
          <div className="flex-container">
            <label htmlFor="username">Username:</label>
          </div>
        </div>
        <input type="text" name="username"></input>
      </div>
      <div className="line">
        <div className="label">
          <div className="flex-container">
            <label htmlFor="password">Password:</label>
          </div>
        </div>
        <input type="password" name="password"></input><br></br>
      </div>
      <div className="submit">
        <input type="submit" value="Login"></input>
      </div>
    </form>
  </div>,
  document.getElementById('content'),
);