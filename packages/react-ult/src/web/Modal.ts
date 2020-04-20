/**
 * Modal.tsx
 *
 * Web-specific implementation of the cross-platform Modal abstraction.
 */

import * as React from 'react';

import assert from '../common/assert';
import * as Ult from '../common/Interfaces';

import FrontLayerViewManager from './FrontLayerViewManager';

export class Modal extends Ult.Modal {
    isDisplayed(modalId?: string): boolean {
        return FrontLayerViewManager.isModalDisplayed(modalId);
    }

    show(modal: React.ReactElement<Ult.Types.ViewProps>, modalId: string, options?: Ult.Types.ModalOptions): void {
        assert(modal, `modal must be valid. Actual ${ modal }`);
        assert(modalId, `modalId must be a non-empty string. Actual: ${ modalId }`);

        FrontLayerViewManager.showModal(modal, modalId, options);
    }

    dismiss(modalId: string): void {
        assert(modalId, `modalId must be a non-empty string. Actual: ${ modalId }`);

        FrontLayerViewManager.dismissModal(modalId);
    }

    dismissAll(): void {
        FrontLayerViewManager.dismissAllModals();
    }
}

export default new Modal();
