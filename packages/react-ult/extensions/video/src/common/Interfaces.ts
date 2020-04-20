/*
 * Interfaces.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Interface definition for cross-platform ReactXP plugin for
 * display videos and controlling video playback.
 */

import * as RX from 'reactxp';

import * as Types from './Types';

export abstract class Video extends RX.Component<Types.VideoProps, RX.Stateless> {
    abstract seek(position: number): void;
    abstract play(): void;
    abstract pause(): void;
    abstract mute(muted: boolean): void;
}

export interface PluginInterface {
    Types: typeof Types;

    default: typeof Video;
}
