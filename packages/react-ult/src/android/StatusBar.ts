/**
 * StatusBar.ts
 *
 * Android-specific implementation of StatusBar APIs.
 */

import * as RN from 'react-native';
import * as Ult from '../common/Interfaces';

export class StatusBar extends Ult.StatusBar {
  isOverlay(): boolean {
    // Android draws the status bar as a view that takes up space
    // of its own, as opposed to an overlay like on iOS.
    return false;
  }

  setHidden(hidden: boolean, showHideTransition: 'slide' | 'fade'): void {
    RN.StatusBar.setHidden(hidden, showHideTransition);
  }

  setBackgroundColor(color: string, animated: boolean): void {
    RN.StatusBar.setBackgroundColor(color, animated);
  }

  setTranslucent(translucent: boolean): void {
    RN.StatusBar.setTranslucent(translucent);
  }

  setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void {
    // Nothing to do on android
  }

  setNetworkActivityIndicatorVisible(value: boolean): void {
    // Nothing to do on android
  }
}

export default new StatusBar();
