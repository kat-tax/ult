/**
 * Video.tsx
 *
 * Windows-specific implementation of the cross-platform Video abstraction.
 */

import * as React from 'react';
import * as RN from 'react-native';
import * as Ult from 'react-ult';
import * as Types from '../common/Types';
import extend = require('lodash/extend');

export interface VideoState {
  isPlaying?: boolean;
  duration?: number;
}

class Video extends Ult.Component<Types.VideoProps, VideoState> {
  // TODO(uwp): #694149 Not implemented
  render() {
    let combinedStyles = extend(Ult.Styles.combine(this.props.style), {
      backgroundColor: 'red'
    });

    return (
      <RN.View style={combinedStyles}>
        <RN.Text>Video</RN.Text>
      </RN.View>
    );
  }

  seek(position: number) {
    // TODO(uwp): #694149 Not implemented
  }

  seekPercent(percentage: number) {
    // TODO(uwp): #694149 Not implemented
  }

  play() {
    // TODO(uwp): #694149 Not implemented
  }

  pause() {
    // TODO(uwp): #694149 Not implemented
  }

  stop() {
    this.pause();
    this.seek(0);
  }

  mute(muted: boolean) {
    // TODO(uwp): #694149 Not implemented
  }
}

export default Video;
