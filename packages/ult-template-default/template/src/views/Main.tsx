import React from 'react';
import {App, UserInterface} from 'react-ult';
import {isDev, isDebug} from '../features/platform';
import {AppGreeting} from './app/AppGreeting';

App.initialize(isDev(), isDebug());
UserInterface.useCustomScrollbars(true);
UserInterface.setMainView(<AppGreeting/>);
