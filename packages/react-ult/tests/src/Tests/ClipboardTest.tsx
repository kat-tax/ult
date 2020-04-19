/*
* Tests the Ult.Clipboard APIs in an interactive manner.
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
  labelContainer: Ult.Styles.View({
    alignSelf: 'center',
    margin: 8
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  labelText: Ult.Styles.Text({
    fontSize: 24,
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
  })
};

interface ClipboardViewState {
  copyIteration: number;
  pastedText: string;
}

const _copyString = 'Text to copy\n(including line breaks)\n';

class ClipboardView extends Ult.Component<Ult.CommonProps, ClipboardViewState> {
  private _presencesChangedEvent: Ult.Types.SubscriptionToken | undefined;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      copyIteration: 1,
      pastedText: ''
    };
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Press the button to copy the following text to the clipboard. Switch to another app and paste to verify.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.labelText}>
            {_copyString + this.state.copyIteration}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={() => this._doCopy()}>
          <Ult.Text style={_styles.buttonText}>
            {'Copy to Clipboard'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Press the button to paste the text contents of the clipboard.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={() => this._doPaste()}>
          <Ult.Text style={_styles.buttonText}>
            {'Paste from Clipboard'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.labelText}>
            {this.state.pastedText}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  private _doCopy() {
    Ult.Clipboard.setText(_copyString + this.state.copyIteration);
    this.setState({copyIteration: this.state.copyIteration + 1});
  }

  private _doPaste() {
    Ult.Clipboard.getText().then(text => {
      this.setState({pastedText: text});
    }).catch(err => {
      this.setState({pastedText: '(Received error when pasting: ' + err + ')'});
    });
  }
}

class ClipboardTest implements Test {
  getPath(): string {
    return 'APIs/Clipboard';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <ClipboardView ref={onMount} />;
  }
}

export default new ClipboardTest();
