import "./App.css";
import React from "react";

import { ThemeProvider, createTheme } from "@material-ui/core";

import Home from "./views/Home/Home";

const baseTheme = createTheme();

const App = () => {
  return (
    <ThemeProvider theme={baseTheme}>
      <div className="App">
        <Home></Home>
      </div>
    </ThemeProvider>
  );
};

export default App;
