import './App.css';
import { ThemeProvider, createTheme } from '@material-ui/core';
import Home from './views/Home/Home';
import React from 'react';

const baseTheme = createTheme();

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
