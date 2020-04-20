/**
 * Input.ts
 *
 * RN Desktop implementation of Input interface.
 */

import { Input as InputCommon } from '../native-common/Input';
import { Types } from '../common/Interfaces';

export class Input extends InputCommon {
    constructor() {
        super();
    }

    dispatchKeyDown(e: Types.KeyboardEvent): void {
        this.keyDownEvent.fire(e);
    }

    dispatchKeyUp(e: Types.KeyboardEvent): void {
        if (this.keyUpEvent.fire(e)) {
            e.stopPropagation();
        }
    }
}

export default new Input();
