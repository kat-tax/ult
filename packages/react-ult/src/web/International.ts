/**
 * International.ts
 *
 * Web-specific implementation for i18n.
 */

import * as Ult from '../common/Interfaces';

import FrontLayerViewManager from './FrontLayerViewManager';

export class International implements Ult.International {
    allowRTL(allow: boolean): void {
        FrontLayerViewManager.allowRTL(allow);
    }

    forceRTL(force: boolean): void {
        FrontLayerViewManager.forceRTL(force);
    }

    isRTL(): boolean {
        return FrontLayerViewManager.isRTL();
    }
}

export default new International();
