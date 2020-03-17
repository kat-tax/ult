/**
 * Picker.tsx
 *
 * RN-specific implementation of the cross-platform Picker abstraction.
 */

import * as React from 'react';
import * as RN from 'react-native';
import * as Ult from '../common/Interfaces';
import {map} from './utils/lodashMini';

export class Picker extends Ult.Picker {
  render() {
    return (
      <RN.Picker
        selectedValue={this.props.selectedValue}
        onValueChange={this.onValueChange}
        style={this.props.style as RN.StyleProp<RN.ViewStyle>}
        mode={this.props.mode}
        testID={this.props.testId}>
        {map(this.props.items, (i, idx) =>
          <RN.Picker.Item {...i} key={idx} />
        )}
      </RN.Picker>
    );
  }

  onValueChange = (itemValue: any, itemPosition: number) => {
    this.props.onValueChange(itemValue, itemPosition);
  }
}

export default Picker;
