import React from 'react';
import {App, UserInterface} from 'reactxp';
import {AppFrame} from 'app/ui/AppFrame';

App.initialize(true, true);
UserInterface.setMainView(
  <AppFrame/>
);
