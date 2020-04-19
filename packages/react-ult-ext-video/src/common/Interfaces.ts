/*
 * Interfaces.ts
 *
 * Interface definition for cross-platform ULT plugin for
 * display videos and controlling video playback.
 */

import * as Ult from 'react-ult';
import * as Types from './Types';

export abstract class Video extends Ult.Component<Types.VideoProps, Ult.Stateless> {
  abstract seek(position: number): void;
  abstract play(): void;
  abstract pause(): void;
  abstract mute(muted: boolean): void;
}

export interface PluginInterface {
  Types: typeof Types;
  default: typeof Video;
}
