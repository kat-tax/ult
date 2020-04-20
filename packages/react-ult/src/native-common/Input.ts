/**
 * Input.ts
 *
 * Native implementation of Input interface.
 */

import * as RN from 'react-native';

import * as RX from '../common/Interfaces';

export class Input extends RX.Input {
    constructor() {
        super();

        RN.BackHandler.addEventListener('hardwareBackPress', () => this.backButtonEvent.fire());
    }
}

export default new Input();
