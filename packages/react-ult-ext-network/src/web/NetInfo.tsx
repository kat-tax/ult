/**
 * Video.tsx
 *
 * Web-specific implementation of the cross-platform Video abstraction.
 */

import * as Interfaces from '../common/Interfaces';
import * as Types from '../common/Types';

export class NetInfo extends Interfaces.NetInfo {
  constructor() {
    super();

    const onEventOccuredHandler = () => {
      this.connectivityChangedEvent.fire(navigator.onLine);
    };

    // Avoid accessing window if it's not defined (for test environment).
    if (typeof(window) !== 'undefined') {
      window.addEventListener('online', onEventOccuredHandler);
      window.addEventListener('offline', onEventOccuredHandler);
    }
  }

  isConnected(): Promise<boolean> {
    return Promise.resolve(navigator.onLine);
  }

  getType(): Promise<Types.DeviceNetworkType> {
    return Promise.resolve(Types.DeviceNetworkType.Unknown);
  }
}

export default new NetInfo();
