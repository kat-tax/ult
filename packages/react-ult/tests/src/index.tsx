/*
* Main entry point for web app.
*/

import Ult = require('react-ult');
import App = require('./App');

Ult.App.initialize(true, true);
Ult.UserInterface.useCustomScrollbars(true);
Ult.UserInterface.setMainView(<App/>);
