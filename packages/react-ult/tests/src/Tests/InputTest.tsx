/*
* Tests the Ult.Input APIs.
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
    color: 'black'
  })
};

interface InputState {
  backButtonCount?: number;
  keyDownCount?: number;
  lastKeyDownKey?: string;
  lastKeyDownModifiers?: string;
  keyUpCount?: number;
  lastKeyUpKey?: string;
  lastKeyUpModifiers?: string;
}

class InputView extends Ult.Component<Ult.CommonProps, InputState> {
  private _backButtonEvent: Ult.Types.SubscriptionToken | undefined;
  private _keyDownEvent: Ult.Types.SubscriptionToken | undefined;
  private _keyUpEvent: Ult.Types.SubscriptionToken | undefined;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      backButtonCount: 0,
      keyDownCount: 0,
      lastKeyDownKey: '',
      lastKeyDownModifiers: '',
      keyUpCount: 0,
      lastKeyUpKey: '',
      lastKeyUpModifiers: ''
    };
  }

  componentDidMount() {
    this._backButtonEvent = Ult.Input.backButtonEvent.subscribe(() => {
      this.setState({backButtonCount: this.state.backButtonCount! + 1});
      return true;
    });

    this._keyDownEvent = Ult.Input.keyDownEvent.subscribe(e => {
      this.setState({
        keyDownCount: this.state.keyDownCount! + 1,
        lastKeyDownKey: 'Key = "' + e.key + '", Code = ' + e.keyCode,
        lastKeyDownModifiers: 'Ctrl = ' + e.ctrlKey + ', Alt = ' + e.altKey +
          ', Shift = ' + e.shiftKey

      });
      return true;
    });

    this._keyUpEvent = Ult.Input.keyUpEvent.subscribe(e => {
      this.setState({
        keyUpCount: this.state.keyUpCount! + 1,
        lastKeyUpKey: 'Key = "' + e.key + '", Code = ' + e.keyCode,
        lastKeyUpModifiers: 'Ctrl = ' + e.ctrlKey + ', Alt = ' + e.altKey + ', Shift = ' + e.shiftKey
      });
      return true;
    });

  }

  componentWillUnmount() {
    if (this._backButtonEvent) {
      this._backButtonEvent.unsubscribe();
    }

    if (this._keyDownEvent) {
      this._keyDownEvent.unsubscribe();
    }

    if (this._keyUpEvent) {
      this._keyUpEvent.unsubscribe();
    }
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Pressing the back button (Android only) should increment the count below.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'back'}>
          <Ult.Text style={_styles.labelText}>
            {'Back button events: ' + this.state.backButtonCount}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Pressing a keyboard button (keyboard-based platforms only) should increment the counts below.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'keyDown'}>
          <Ult.Text style={_styles.labelText}>
            {'Key down events: ' + this.state.keyDownCount}
          </Ult.Text>
          <Ult.Text style={_styles.labelText}>
            {'Last key: ' + this.state.lastKeyDownKey}
          </Ult.Text>
          <Ult.Text style={_styles.labelText}>
            {'Last modifiers: ' + this.state.lastKeyDownModifiers}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'keyUp'}>
          <Ult.Text style={_styles.labelText}>
            {'Key up events: ' + this.state.keyUpCount}
          </Ult.Text>
          <Ult.Text style={_styles.labelText}>
            {'Last key: ' + this.state.lastKeyUpKey}
          </Ult.Text>
          <Ult.Text style={_styles.labelText}>
            {'Last modifiers: ' + this.state.lastKeyUpModifiers}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }
}

class InputTest implements Test {
  getPath(): string {
    return 'APIs/Input';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <InputView ref={onMount}/>;
  }
}

export default new InputTest();
