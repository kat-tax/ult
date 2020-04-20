/**
 * Input.ts
 *
 * Native implementation of Input interface.
 */

import * as RN from 'react-native';

import * as Ult from '../common/Interfaces';

export class Input extends Ult.Input {
    constructor() {
        super();

        RN.BackHandler.addEventListener('hardwareBackPress', () => this.backButtonEvent.fire());
    }
}

export default new Input();
