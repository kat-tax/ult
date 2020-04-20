/**
 * StatusBar.ts
 *
 * Web-specific implementation of the cross-platform status bar.
 */

import * as RX from '../common/Interfaces';

export class StatusBar extends RX.StatusBar {
    isOverlay(): boolean {
        return false;
    }

    setBarStyle(style: 'default' | 'light-content' | 'dark-content', animated: boolean): void {
        // Nothing to do on Web
    }

    setHidden(hidden: boolean, showHideTransition: 'fade' | 'slide'): void {
        // Nothing to do on Web
    }

    setNetworkActivityIndicatorVisible(value: boolean): void {
        // Nothing to do on the web
    }

    setBackgroundColor(color: string, animated: boolean): void {
        // Nothing to do on the web
    }

    setTranslucent(translucent: boolean): void {
        // Nothing to do on the web
    }
}

export default new StatusBar();
