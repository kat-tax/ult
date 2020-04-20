/**
 * StatusBar.ts
 *
 * iOS-specific implementation of StatusBar APIs.
 */

import * as RN from 'react-native';

import * as Ult from '../common/Interfaces';

export class StatusBar extends Ult.StatusBar {
    isOverlay(): boolean {
        // iOS always draws the status bar as an overlay, as opposed
        // to a view that takes up space of its own.
        return true;
    }

    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void {
        RN.StatusBar.setBarStyle(style, animated);
    }

    setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void {
        RN.StatusBar.setHidden(hidden, showHideTransition);
    }

    setNetworkActivityIndicatorVisible(value: boolean): void {
        RN.StatusBar.setNetworkActivityIndicatorVisible(value);
    }

    setBackgroundColor(color: string, animated: boolean): void {
        // Nothing to do on iOS
    }

    setTranslucent(translucent: boolean): void {
        // Nothing to do on iOS
    }
}

export default new StatusBar();
