import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import React from 'react';
import './App.css';
import Home from './views/Home/Home';

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
