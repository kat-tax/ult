/**
 * UserPresence.ts
 *
 * Native implementation of the Ult interfaces related to
 * user presence.
 */

import * as Ult from '../common/Interfaces';

export class UserPresence extends Ult.UserPresence {
  // On native platforms, assume that the user is present
  // whenever the app is running.
  isUserPresent(): boolean {
    return true;
  }
}

export default new UserPresence();
