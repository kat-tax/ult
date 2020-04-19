/**
 * Picker.tsx
 *
 * Web-specific implementation of the cross-platform Select abstraction.
 */

import * as React from 'react';
import * as Ult from '../common/Interfaces';
import * as _ from './utils/lodashMini';
import Styles from './Styles';

export class Picker extends Ult.Picker {
  render() {
    return (
      <select
        style={this._getStyles() as any}
        value={this.props.selectedValue}
        onChange={this._onValueChange}
        data-test-id={this.props.testId}>
        {_.map(this.props.items, (i, idx) =>
          <option value={i.value} key={idx}>
            {i.label}
          </option>
        )}
      </select>
    );
  }

  private _getStyles(): Ult.Types.PickerStyleRuleSet {
    return Styles.combine(this.props.style) as any;
  }

  private _onValueChange = (e: React.SyntheticEvent<any>) => {
    const selectEl = e.target as HTMLSelectElement;
    const selectedValue = selectEl.value;
    const selectedItemPosition = _.findIndex(this.props.items, i => i.value === selectedValue);
    this.props.onValueChange(selectedValue, selectedItemPosition);
  }
}

export default Picker;
