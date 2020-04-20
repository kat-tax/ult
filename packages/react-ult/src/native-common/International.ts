/**
 * International.ts
 *
 * RN-specific implementation for i18n.
 */

import * as RN from 'react-native';

import * as Ult from '../common/Interfaces';

export class International implements Ult.International {
    private _isRTL: boolean;

    constructor() {
        // RN.I18nManager.isRTL is a constant, a good start.
        this._isRTL = RN.I18nManager.isRTL;

        // Register for changes (some platforms may never raise this event)
        RN.DeviceEventEmitter.addListener('isRTLChanged', (payload: RN.RtlEventNativePayload) => {this._isRTL = payload.isRTL; });
    }

    allowRTL(allow: boolean): void {
        RN.I18nManager.allowRTL(allow);
    }

    forceRTL(force: boolean): void {
        RN.I18nManager.forceRTL(force);
    }

    isRTL(): boolean {
        return this._isRTL;
    }
}

export default new International();
