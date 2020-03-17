/*
* Tests the functionality of a TextInput component with
* the help of user validation.
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
  resultContainer: Ult.Styles.View({
    margin: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  }),
  resultText: Ult.Styles.Text({
    flex: -1,
    marginLeft: 12,
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  textInput1: Ult.Styles.TextInput({
    flex: 1,
    maxWidth: 200,
    borderWidth: 1,
    fontSize: CommonStyles.generalFontSize,
    padding: 4,
    borderColor: '#999'
  }),
  textInput2: Ult.Styles.TextInput({
    flex: 1,
    width: 200,
    borderWidth: 1,
    fontSize: CommonStyles.generalFontSize,
    color: 'green',
    padding: 4,
    borderColor: '#999'
  }),
  textInput3: Ult.Styles.TextInput({
    margin: 12,
    width: 200,
    height: 100,
    borderWidth: 1,
    fontSize: CommonStyles.generalFontSize,
    padding: 4,
    borderColor: '#999'
  }),
  textInput7: Ult.Styles.TextInput({
    flex: 1,
    maxWidth: 200,
    borderWidth: 1,
    fontSize: CommonStyles.generalFontSize,
    padding: 4,
    borderColor: '#999',
    shadowColor: 'red',
    shadowOffset: {width: 1, height: 4},
    shadowRadius: 5
  }),
  eventHistoryScrollView: Ult.Styles.ScrollView({
    margin: 12,
    padding: 8,
    alignSelf: 'stretch',
    height: 100,
    backgroundColor: '#eee'
  }),
  eventHistoryText: Ult.Styles.Text({
    fontSize: 12,
  }),
  placeholder: Ult.Styles.View({
    width: 1,
    height: 300
  }),
  button: Ult.Styles.Button({
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4
  }),
  buttonText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: '#666'
  })
};

interface TextInputViewState {
  test1Input: string;
  test2Input: string;
  test6Input: string;
  test6EventHistory: string[];
  test7Input: string;
}

class TextInputView extends Ult.Component<Ult.CommonProps, TextInputViewState> {
  private _multilineTextInput: Ult.TextInput | null = null;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      test1Input: '',
      test2Input: '',
      test6Input: '',
      test6EventHistory: [],
      test7Input: ''
    };
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'This is a single-line text input box. ' +
              'The placeholder text is light blue. ' +
              'Input is limited to 8 characters in length. ' +
              'Text is centered. ' +
              'Auto-correct is disabled. ' +
              'Auto-focus is enabled. ' +
              'The return key type (for on-screen keyboards) is "done". '}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.TextInput
            style={_styles.textInput1}
            placeholder={'Type here'}
            placeholderTextColor={'blue'}
            maxLength={10}
            returnKeyType={'done'}
            value={this.state.test1Input}
            autoCorrect={false}
            accessibilityId={'TextInputViewTextInput'}
            autoFocus={true}
            onChangeText={val => this.setState({test1Input: val})}
          />
          <Ult.Text style={_styles.resultText} numberOfLines={1}>
            {this.state.test1Input}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'This is a multi-line text input box. ' +
              'For on-screen keyboards, the return key should be "go", and the keyboard should use a light theme. ' +
              'Text should be green. ' +
              'It supports auto correct, auto capitalization (individual words), and spell checking. '}
          </Ult.Text>
          <Ult.Text style={_styles.explainText}>
            {'Press this button to set the focus to the multi-line text input box below. '}
          </Ult.Text>
          <Ult.Button style={_styles.button} onPress={this._onPressFocus}>
            <Ult.Text style={_styles.buttonText}>
              {'Focus'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.TextInput
            ref={this._onMountTextInput}
            style={_styles.textInput2}
            placeholder={'Placeholder text'}
            returnKeyType={'go'}
            value={this.state.test2Input}
            onChangeText={val => this.setState({test2Input: val})}
            allowFontScaling={false}
            autoCorrect={true}
            autoCapitalize={'words'}
            spellCheck={true}
            blurOnSubmit={true}
            editable={true}
            keyboardAppearance={'light'}
            multiline={true}
          />
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'This text input box uses the "defaultValue" to specify the initial value. ' +
              'The keyboard type is "numeric". ' +
              'The text is right-justified. ' +
              'The return key type (for on-screen keyboards) is "send". '}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.TextInput
            style={_styles.textInput1}
            placeholder={'PIN'}
            returnKeyType={'send'}
            keyboardType={'numeric'}
            defaultValue={'1234'}
            disableFullscreenUI={true}
          />
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'This text input box is not editable. '}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.TextInput
            style={_styles.textInput1}
            placeholder={'Disabled'}
            editable={false}
          />
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation5'}>
          <Ult.Text style={_styles.explainText}>
            {'This text input box obscures the text (for password entry). ' +
              'It uses an "email-address" keyboard type. '}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.TextInput
            style={_styles.textInput1}
            placeholder={'Enter password'}
            secureTextEntry={true}
            keyboardType={'email-address'}
          />
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation6'}>
          <Ult.Text style={_styles.explainText}>
            {'This is a multi-line text input box. ' +
              'It records and displays all events (displayed in reverse order). Try focus, blur, typing, ' +
              'pasting, scrolling, changing selections, and submitting (hit return). '}
          </Ult.Text>
        </Ult.View>
        <Ult.TextInput
          style={_styles.textInput3}
          autoCorrect={false}
          value={this.state.test6Input}
          onChangeText={this._onChangeTextTest6}
          onKeyPress={this._onKeyPressTest6}
          onBlur={this._onBlurTest6}
          onFocus={this._onFocusTest6}
          onPaste={this._onPasteTest6}
          onScroll={this._onScrollTest6}
          onSelectionChange={this._onSelectionChangeTest6}
          onSubmitEditing={this._onSubmitEditingTest6}
          multiline={true}
        />
        <Ult.View style={_styles.eventHistoryScrollView}>
          <Ult.ScrollView>
            <Ult.Text style={_styles.eventHistoryText}>
              {this.state.test6EventHistory.length
                ? this.state.test6EventHistory.join('\n')
                : 'Event history will appear here'
              }
            </Ult.Text>
          </Ult.ScrollView>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation7'}>
          <Ult.Text style={_styles.explainText}>
            {'The text entered in this input box will have a red shadow.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.TextInput
            style={_styles.textInput7}
            value={this.state.test7Input}
            onChangeText={val => this.setState({test7Input: val})}
          />
          <Ult.Text style={_styles.resultText}>
            {this.state.test1Input}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation8'}>
          <Ult.Text style={_styles.explainText}>
            {'This text input box uses the "clearButtonMode" prop to hide the `X` that appears while typing. ' +
              '(This is only relevant to iOS and UWP apps). '}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.TextInput
            style={_styles.textInput1}
            placeholder={'This box will not have the usual `X` delete button as you type.'}
            clearButtonMode={'never'}
          />
        </Ult.View>
        <Ult.View style={_styles.placeholder}/>
      </Ult.View>
    );
  }

  private _onMountTextInput = (elem: any) => {
    this._multilineTextInput = elem;
  }

  private _onPressFocus = (e: Ult.Types.SyntheticEvent) => {
    e.stopPropagation();
    if (this._multilineTextInput) {
      this._multilineTextInput.focus();
    }
  }

  private _onChangeTextTest6 = (value: string) => {
    this.setState({test6Input: value});
    this._appendHistoryTest6('onChangeText');
  }

  private _onKeyPressTest6 = (e: Ult.Types.KeyboardEvent) => {
    let eventText = 'onKeyPress: ' + 'Key = "' + e.key + '", Code = ' + e.keyCode;
    this._appendHistoryTest6(eventText);
  }

  private _onPasteTest6 = (e: Ult.Types.ClipboardEvent) => {
    this._appendHistoryTest6('onPaste');
  }

  private _onScrollTest6 = (newScrollLeft: number, newScrollTop: number) => {
    this._appendHistoryTest6('onSroll: (left=' + newScrollLeft +
      ', top=' + newScrollTop + ')');
  }

  private _onBlurTest6 = (e: Ult.Types.FocusEvent) => {
    this._appendHistoryTest6(`onBlur: ${this._focusEventToString(e)}`);
  }

  private _onFocusTest6 = (e: Ult.Types.FocusEvent) => {
    this._appendHistoryTest6(`onFocus: ${this._focusEventToString(e)}`);
  }

  private _focusEventToString = ({bubbles, cancelable, defaultPrevented, timeStamp, nativeEvent}: Ult.Types.FocusEvent) => {
    return JSON.stringify({bubbles, cancelable, defaultPrevented, timeStamp, nativeEvent});
  }

  private _onSelectionChangeTest6 = (start: number, end: number) => {
    this._appendHistoryTest6('onSelectionChange: [' + start + ', ' + end + ']');
  }

  private _onSubmitEditingTest6 = () => {
    this._appendHistoryTest6('onSubmitEditing');
  }

  private _appendHistoryTest6(newLine: string) {
    // Prepend it so we can always see the latest.
    // Limit to the last 20 items.
    let newHistory = [newLine].concat(_.slice(this.state.test6EventHistory, 0, 18));
    this.setState({test6EventHistory: newHistory});
  }
}

class TextInputTest implements Test {
  getPath(): string {
    return 'Components/TextInput/Interactive';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <TextInputView ref={onMount}/>;
  }
}

export default new TextInputTest();
