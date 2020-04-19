/*
* Tests the functionality of the Picker component
* with manual user validation.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {Test, TestResult, TestType} from '../Test';

const _styles = {
  container: Ult.Styles.View({
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }),
  explainTextContainer: Ult.Styles.View({
    margin: 12
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  resultText: Ult.Styles.Text({
    marginLeft: 20,
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  pickerContainer: Ult.Styles.View({
    alignSelf: 'stretch',
    alignItems: 'center'
  }),
  picker: Ult.Styles.Picker({
    alignSelf: 'stretch'
  }),
  pickerWeb: Ult.Styles.Picker({
    alignSelf: 'center',
    marginVertical: 12,
    height: 24,
    width: 100
  })
};

interface PickerViewState {
  test1Value: string;
  test2Value: string;
}

class PickerView extends Ult.Component<Ult.CommonProps, PickerViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);

    this.state = {
      test1Value: 'platform1',
      test2Value: ''
    };
  }

  render() {
    const picker1Items: Ult.Types.PickerPropsItem[] = [
      {label: 'Windows', value: 'platform1'},
      {label: 'iOS', value: 'platform2'},
      {label: 'Android', value: 'platform3'}
    ];

    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Select item from picker.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.pickerContainer}>
          <Ult.Picker
            style={[_styles.picker, Ult.Platform.getType() === 'web' ? _styles.pickerWeb : undefined]}
            selectedValue={this.state.test1Value || ''}
            items={picker1Items}
            mode={'dialog'}
            onValueChange={this._onValueChanged1}
            testId={'picker1'}
          />
          <Ult.Text style={_styles.resultText}>
            {'You selected "' +
              _.find(picker1Items, item => item.value === this.state.test1Value)!.label + '"'
            }
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  private _onValueChanged1 = (itemValue: string, itemPosition: number) => {
    this.setState({test1Value: itemValue});
  }
}

class PickerTest implements Test {
  getPath(): string {
    return 'Components/Picker';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <PickerView ref={onMount}/>;
  }
}

export default new PickerTest();
