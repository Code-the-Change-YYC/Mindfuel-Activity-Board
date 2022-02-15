import './App.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import Home from './views/Home/Home';
import React from 'react';

const baseTheme = createMuiTheme();

const App = () => {
  return (
    <ThemeProvider theme={baseTheme}>
      <div className="App">
          <Home></Home>
      </div>
    </ThemeProvider>
  );
}

export default App;
