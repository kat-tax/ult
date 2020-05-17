import React from 'react';
import {App, UserInterface} from 'react-ult';
import {AppFrame} from 'app/ui/AppFrame';
import {utils} from 'app';

const isWeb = utils.isWeb;
const isDev = process.env.ULT_APP_DEV == 'true';
const isDebug = process.env.ULT_APP_DEBUG == 'true';

App.initialize(isDev, isDebug);
UserInterface.setMainView(<AppFrame/>);
isWeb && UserInterface.useCustomScrollbars(true);
