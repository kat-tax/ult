/**
 * Input.ts
 *
 * Web implementation of Input interface.
 */

import * as RX from '../common/Interfaces';

export class Input extends RX.Input {
    dispatchKeyDown(e: RX.Types.KeyboardEvent): void {
        this.keyDownEvent.fire(e);
    }

    dispatchKeyUp(e: RX.Types.KeyboardEvent): void {
        if (this.keyUpEvent.fire(e)) {
            e.stopPropagation();
        }
    }
}

export default new Input();
