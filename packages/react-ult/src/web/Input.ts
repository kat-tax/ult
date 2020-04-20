/**
 * Input.ts
 *
 * Web implementation of Input interface.
 */

import * as Ult from '../common/Interfaces';

export class Input extends Ult.Input {
    dispatchKeyDown(e: Ult.Types.KeyboardEvent): void {
        this.keyDownEvent.fire(e);
    }

    dispatchKeyUp(e: Ult.Types.KeyboardEvent): void {
        if (this.keyUpEvent.fire(e)) {
            e.stopPropagation();
        }
    }
}

export default new Input();
