/**
 * Alert.ts
 *
 * Web Alert dialog boxes.
 */

import * as React from 'react';

import * as Ult from '../common/Interfaces';

import { AlertModalContent } from './AlertModalContent';
import Modal from './Modal';

// Web/HTML implementation for alert dialog boxes
export class Alert extends Ult.Alert {
    private _modalId = 'ULT.Alert_WebModal';

    show(title: string, message?: string, buttons?: Ult.Types.AlertButtonSpec[],
            options?: Ult.Types.AlertOptions): void {
        Modal.show(
            (
                <AlertModalContent
                    modalId={ this._modalId }
                    buttons={ buttons }
                    title={ title }
                    message={ message }
                    theme={ options && options.theme }
                    preventDismissOnPress={ options && options.preventDismissOnPress }
                />
            ), this._modalId,
        );
    }
}

export default new Alert();
