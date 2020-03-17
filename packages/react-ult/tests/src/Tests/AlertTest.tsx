/*
* Tests the Ult.Alert APIs in an interactive manner.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {Test, TestResult, TestType} from '../Test';

const _styles = {
  container: Ult.Styles.View({
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'flex-start'
  }),
  textContainer: Ult.Styles.View({
    margin: 12
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  labelText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    fontWeight: 'bold',
    color: 'black'
  }),
  button: Ult.Styles.Button({
    backgroundColor: '#ddd',
    borderWidth: 1,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderColor: 'black'
  }),
  buttonText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  buttonPanel: Ult.Styles.View({
    flexDirection: 'column'
  }),
  alertBody: Ult.Styles.View({
    backgroundColor: '#333',
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 8
  }),
  alertTitleText: Ult.Styles.Text({
    fontSize: 24,
    fontStyle: 'italic',
    color: '#eee'
  }),
  alertMessageText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: '#eee'
  }),
  alertButton: Ult.Styles.Button({
    backgroundColor: '#ff8',
    borderRadius: 8
  }),
  alertButtonHover: Ult.Styles.Button({
    backgroundColor: '#dd8'
  }),
  alertButtonText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  alertCancelButton: Ult.Styles.Button({
    backgroundColor: '#f88',
    borderRadius: 8
  }),
  alertCancelButtonHover: Ult.Styles.Button({
    backgroundColor: '#fcc'
  }),
  alertCancelButtonText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    fontWeight: 'bold',
    color: 'white'
  })
};

interface AlertViewState {
  lastOption?: string;
}

class AlertView extends Ult.Component<Ult.CommonProps, AlertViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      lastOption: ''
    };
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Press the button to display an alert.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.buttonPanel}>
          <Ult.Button
            style={_styles.button}
            onPress={() => this._showAlert(false, false)}>
            <Ult.Text style={_styles.buttonText}>
              {'Alert (Default)'}
            </Ult.Text>
          </Ult.Button>
          <Ult.Button
            style={_styles.button}
            onPress={() => this._showAlert(false, true)}>
            <Ult.Text style={_styles.buttonText}>
              {'Alert (Default - preventDismissOnPress)'}
            </Ult.Text>
          </Ult.Button>
          <Ult.Button
            style={_styles.button}
            onPress={() => this._showAlert(true, false)}>
            <Ult.Text style={_styles.buttonText}>
              {'Alert (Custom)'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
        <Ult.View style={_styles.textContainer}>
          <Ult.Text style={_styles.labelText}>
            {this.state.lastOption && 'You chose: ' + this.state.lastOption}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  private _showAlert(custom: boolean, preventDismissOnPress: boolean) {
    const theme = {
      bodyStyle: _styles.alertBody,
      titleTextStyle: _styles.alertTitleText,
      messageTextStyle: _styles.alertMessageText,
      buttonStyle: _styles.alertButton,
      buttonHoverStyle: _styles.alertButtonHover,
      buttonTextStyle: _styles.alertButtonText,
      cancelButtonStyle: _styles.alertCancelButton,
      cancelButtonHoverStyle: _styles.alertCancelButtonHover,
      cancelButtonTextStyle: _styles.alertCancelButtonText,
    };

    Ult.Alert.show('Default Alert', 'Which option would you like to choose?', [
      {text: 'Option 1', onPress: () => this._setLastOption('Option 1'), style: 'default'},
      {text: 'Option 2', onPress: () => this._setLastOption('Option 2')},
      {text: 'Option 3', onPress: () => this._setLastOption('Option 3')},
      {text: 'Destructive', onPress: () => this._setLastOption('Destructive'), style: 'destructive'},
      {text: 'Cancel', onPress: () => this._setLastOption('Cancel'), style: 'cancel'}
    ],
    {preventDismissOnPress, theme: custom ? theme : undefined});
  }

  private _setLastOption(option: string) {
    this.setState({lastOption: option});
  }
}

class AlertTest implements Test {
  getPath(): string {
    return 'APIs/Alert';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <AlertView ref={onMount} />;
  }
}

export default new AlertTest();
