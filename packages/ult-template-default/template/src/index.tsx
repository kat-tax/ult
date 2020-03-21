import React from 'react';
import {App, UserInterface} from 'react-ult';
import {AppFrame} from 'app/ui/AppFrame';

const main = () => (
  <AppFrame/>
);

UserInterface.registerRootView('demo', main);
UserInterface.setMainView(main());
App.initialize(true, true);
