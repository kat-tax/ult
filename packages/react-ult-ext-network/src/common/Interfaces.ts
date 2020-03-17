/*
 * Interfaces.ts
 *
 * Interface definition for cross-platform ULT plugin for gathering network info.
 */

import SubscribableEvent from 'subscribableevent';
import * as Types from './Types';

export abstract class NetInfo {
  abstract isConnected(): Promise<boolean>;
  abstract getType(): Promise<Types.DeviceNetworkType>;
  connectivityChangedEvent = new SubscribableEvent<(isConnected: boolean) => void>();
}

export interface PluginInterface {
  Types: typeof Types;
  default: NetInfo;
}
