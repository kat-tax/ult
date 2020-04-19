/**
 * Popup.tsx
 *
 * React Native implementation of the cross-platform Popup abstraction.
 */

import * as Ult from '../common/Interfaces';
import assert from '../common/assert';
import Timers from '../common/utils/Timers';
import FrontLayerViewManager from './FrontLayerViewManager';

export class Popup extends Ult.Popup {
  show(options: Ult.Types.PopupOptions, popupId: string, delay?: number): boolean {
    assert(popupId, `popupId must be a non-empty string. Actual: ${popupId}`);
    assert(this._isValidAnchor(options), `options must have a valid 'getAnchor()'`);
    return FrontLayerViewManager.showPopup(options, popupId, delay);
  }

  autoDismiss(popupId: string, delay?: number): void {
    assert(popupId, `popupId must be a non-empty string. Actual: ${popupId}`);
    Timers.setTimeout(() => FrontLayerViewManager.dismissPopup(popupId), delay || 0);
  }

  dismiss(popupId: string): void {
    assert(popupId, `popupId must be a non-empty string. Actual: ${popupId}`);
    FrontLayerViewManager.dismissPopup(popupId);
  }

  dismissAll(): void {
    FrontLayerViewManager.dismissAllPopups();
  }

  isDisplayed(popupId?: string): boolean {
    return FrontLayerViewManager.isPopupDisplayed(popupId);
  }

  private _isValidAnchor(options: Ult.Types.PopupOptions): boolean {
    return options && typeof options.getAnchor === 'function' && !!options.getAnchor();
  }
}

export default new Popup();
