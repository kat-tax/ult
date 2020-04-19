/**
 * Alert.ts
 *
 * Native Alert dialog boxes for ULT.
 */

import * as RN from 'react-native';
import AppConfig from '../common/AppConfig';
import * as Ult from '../common/Interfaces';
import UserInterface from '../native-common/UserInterface';

// Native implementation for alert dialog boxes
export class Alert implements Ult.Alert {
  show(
    title: string,
    message?: string,
    buttons?: Ult.Types.AlertButtonSpec[],
    options?: Ult.Types.AlertOptions
  ): void {
    const alertOptions: RN.ExtendedAlertOptions = {};
    if (!!options && options.preventDismissOnPress)
      alertOptions.cancelable = false;
    if (options && options.rootViewId) {
      const nodeHandle = UserInterface.findNodeHandleByRootViewId(options.rootViewId);
      if (nodeHandle) {
        alertOptions.rootViewHint = nodeHandle;
      } else if (AppConfig.isDevelopmentMode()) {
        console.warn('rootViewId does not exist: ', options.rootViewId);
      }
    }

    RN.Alert.alert(title, message, buttons, alertOptions);
  }
}

export default new Alert();
