import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import NavBar from '../NavBar';
import Home from '../Home'
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Route exact path='/' component={NavBar} />
        <Route exact path='/forgotToken' component={NavBar} />
        <Switch>
          <Route exact path='/' component={Home} />
          <Route render={() => (
            <div>
              <p>404 Not Found</p>
              <Link to='/'>Home</Link>
            </div>)} />
        </Switch>
      </div>
    </BrowserRouter>
  );
}

export default App;
