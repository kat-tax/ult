/**
 * Clipboard.tsx
 *
 * RN-specific implementation of the cross-platform Clipboard abstraction.
 */

import * as RN from 'react-native';

import * as RX from '../common/Interfaces';

export class Clipboard extends RX.Clipboard  {
    setText(text: string): void {
        RN.Clipboard.setString(text);
    }

    getText(): Promise<string> {
        return RN.Clipboard.getString();
    }
}

export default new Clipboard();
