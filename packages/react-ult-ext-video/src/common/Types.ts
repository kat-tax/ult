/*
 * Types.ts
 *
 * Type definitions to support the plugin.
 */

import * as React from 'react';
import {Types as UltTypes} from 'react-ult';

// Video interfaces from react-native-video
export interface VideoProgress {
  currentTime: number;
  playableDuration: number;
  atValue?: number;
  target?: number;
  atTimeScale?: number;
}

export interface VideoInfo {
  duration?: number;
  naturalSize?: {
    width: number;
    height: number;
  };
}

export interface VideoProps extends UltTypes.CommonStyledProps<UltTypes.ViewStyleRuleSet, Video> {
  source: string | number;
  accessibilityLabel?: string;
  showControls?: boolean;
  preload?: 'auto'|'metadata'|'none';
  resizeMode?: 'contain'|'cover'|'stretch';
  loop?: boolean;
  authToken?: string;
  shouldRedirectForAndroidHLS?: boolean;

  onBuffer?: () => void;
  onCanPlay?: () => void;
  onCanPlayThrough?: () => void;
  onEnded?: () => void;
  onError?: () => void;
  onLoadStart?: () => void;
  onLoadedData?: (info: VideoInfo) => void;
  onProgress?: (progress: VideoProgress) => void;
}

export abstract class Video extends React.Component<VideoProps, UltTypes.Stateless> {}
