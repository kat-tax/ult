/**
 * Popup.tsx
 *
 * Web-specific implementation of the cross-platform Popup abstraction.
 */

import assert from '../common/assert';
import * as Ult from '../common/Interfaces';
import FrontLayerViewManager from './FrontLayerViewManager';

export class Popup extends Ult.Popup {
  show(options: Ult.Types.PopupOptions, popupId: string, delay?: number): boolean {
    assert(popupId, `popupId must be a non-empty string. Actual: ${popupId}`);
    return FrontLayerViewManager.showPopup(options, popupId, delay);
  }

  autoDismiss(popupId: string, delay?: number): void {
    assert(popupId, `popupId must be a non-empty string. Actual: ${popupId}`);
    FrontLayerViewManager.autoDismissPopup(popupId, delay);
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
}

export default new Popup();
