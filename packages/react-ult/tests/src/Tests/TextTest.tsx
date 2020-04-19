/*
* Tests the functionality of a Text component with
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
    alignSelf: 'stretch',
    marginHorizontal: 36,
    marginVertical: 12
  }),
  test1Text: Ult.Styles.Text({
    fontSize: 24,
    color: '#006'
  }),
  test1Sub2Text: Ult.Styles.Text({
    fontSize: 12,
    color: 'black',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'dotted',
    textDecorationColor: 'green'
  }),
  test1Sub3Text: Ult.Styles.Text({
    fontWeight: 'bold',
    fontStyle: 'italic',
    letterSpacing: 2,
    textDecorationLine: 'underline',
    textDecorationStyle: 'double',
    textDecorationColor: 'red'
  }),
  test2Text: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize
  }),
  test7Text: Ult.Styles.Text({
    fontSize: 16
  }),
  test9Text: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    shadowColor: 'red',
    shadowOffset: {width: 1, height: 4},
    shadowRadius: 5
  }),
  inlineImageContainer: Ult.Styles.View({
    height: 24,
    width: 20,
    marginHorizontal: 8
  }),
  inlineImageContainerOffset: Ult.Styles.View({
    marginBottom: -8
  }),
  inlineImage: Ult.Styles.Image({
    height: 24,
    width: 20
  }),
  test8Text: Ult.Styles.Text({
    fontSize: 16,
    lineHeight: 48,
    textDecorationLine: 'underline'
  }),
  selectTextContainer: Ult.Styles.View({
    margin: 12,
    flexDirection: 'row',
    alignItems: 'center'
  }),
  testSelectText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize
  }),
  selectTextButton: Ult.Styles.Button({
    backgroundColor: '#ddd',
    borderWidth: 1,
    margin: 20,
    padding: 12,
    borderRadius: 8,
    borderColor: 'black'
  }),
  testWarnText: Ult.Styles.Text({
    color: 'red'
  })
};

interface TextViewState {
  test5ColorIndex: number;
  selectedText: string;
}

const _dynamicColors = ['black', 'red', 'green', 'blue'];

class TextView extends Ult.Component<Ult.CommonProps, TextViewState> {
  private _selectionText: Ult.Text | undefined;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      test5ColorIndex: 0,
      selectedText: ''
    };
  }

  render() {
    let test5Style = Ult.Styles.Text({
      color: _dynamicColors[this.state.test5ColorIndex]
    }, false);
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Text components can be nested and inherit some of their style properties from their parent. ' +
              'This is an example of three sub-strings displayed together. ' +
              'The second substring has a green dotted strike-through, and the third ' +
              'substring has 2x spacing and a red double underline.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text
            style={_styles.test1Text}
            importantForAccessibility={Ult.Types.ImportantForAccessibility.Yes}
            id={'test1'}
            allowFontScaling={false}
            testId={'text1'}>
            <Ult.Text>
              {'Substring 1 '}
            </Ult.Text>
            <Ult.Text style={_styles.test1Sub2Text}>
              {'substring 2 '}
            </Ult.Text>
            <Ult.Text style={_styles.test1Sub3Text}>
              {'substring 3 '}
            </Ult.Text>
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Text can wrap to cover multiple lines or constrained to a specified ' +
              'number of lines (and truncated if necessary).'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text}>
            {'A really long string that will wrap to multiple lines if necessary ' +
              'but only if there is insufficient space. ' +
              'A really long string that will wrap to multiple lines if necessary ' +
              'but only if there is insufficient space.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text} numberOfLines={2}>
          {'A really long string that will wrap to two lines if necessary ' +
              'but only if there is insufficient space. ' +
              'A really long string that will wrap to two lines if necessary ' +
              'but only if there is insufficient space. '}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Truncation can be done at the head, middle or tail.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text} numberOfLines={1} ellipsizeMode={'head'}>
            {'A really long string that will trunctate to one line if necessary ' +
            'but only if there is insufficient space. (Head truncation)'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text} numberOfLines={1} ellipsizeMode={'middle'}>
            {'(Middle truncation) A really long string that will trunctate to one line if necessary ' +
            'but only if there is insufficient space.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text} numberOfLines={1} ellipsizeMode={'tail'}>
            {'(Tail truncation) A really long string that will trunctate to one line if necessary ' +
            'but only if there is insufficient space.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'By default, text is not selectable (on mouse-based systems).'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text}>
            {'This text is not selectable'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text} selectable={true}>
            {'This text is selectable'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation5'}>
          <Ult.Text style={_styles.explainText}>
            {'Click or tap on the text below to change its color.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text
            style={[_styles.test2Text, test5Style]}
            onPress={this._onPressTest5}>
            {'Text with an onPress handler'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation6'}>
          <Ult.Text style={_styles.explainText}>
            {'On some platforms (iOS and Android), text can be scaled according to user preferences.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text} allowFontScaling={false}>
            {'This text does not scale regardless of system settings'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text}>
            {'This text scales based on system settings'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test2Text}>
            {'This text scales up to 1.2x, no more'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation7'}>
          <Ult.Text style={_styles.explainText}>
            {'Fixed-size views can be inlined within a text block.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          {Ult.Platform.getType() !== 'web' ? (
            <Ult.Text style={_styles.testWarnText}>
              {'Test disabled due to broken RN 0.57 support of inline views'} 
            </Ult.Text>
          ) : ( 
            <Ult.Text style={_styles.test7Text}>
              <Ult.Text>
                {'Do you have a bright '}
              </Ult.Text>
              <Ult.View style={_styles.inlineImageContainer}>
                <Ult.Image
                  source={'https://microsoft.github.io/reactxp/img/tests/bulb.jpg'}
                  resizeMode={'contain'}
                  style={_styles.inlineImage}
                />
              </Ult.View>
              <Ult.Text>
                {' to share?'}
              </Ult.Text>
            </Ult.Text>
          )}
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation8'}>
          <Ult.Text style={_styles.explainText}>
            {'Max line height can be adjusted for multi-line text blocks.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          {Ult.Platform.getType() !== 'web' ? (
            <Ult.Text style={_styles.testWarnText}>
              {'Test disabled due to broken RN 0.57 support of inline views'} 
            </Ult.Text>
          ) : ( 
            <Ult.Text style={_styles.test8Text}>
              <Ult.Text>
                {'This is a really long string with a '}
              </Ult.Text>
              <Ult.View style={[_styles.inlineImageContainer, _styles.inlineImageContainerOffset]}>
                <Ult.Image
                  source={'https://microsoft.github.io/reactxp/img/tests/bulb.jpg'}
                  resizeMode={'contain'}
                  style={_styles.inlineImage}
                />
              </Ult.View>
              <Ult.Text>
                {' light bulb inlined within it. It is meant to demonstrate a' +
                ' larger-than-normal line height.'}
              </Ult.Text>
            </Ult.Text>
          )}
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation9'}>
          <Ult.Text style={_styles.explainText}>
            {'Text shadows can be applied with the shadow style props.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.resultContainer}>
          <Ult.Text style={_styles.test9Text}>
            {'Text with a red shadow.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.selectTextContainer}>
          <Ult.Text 
            style={_styles.testSelectText} 
            selectable={true}
            ref={(comp: any) => {this._selectionText = comp}}>
            {'Select from this text.'}
          </Ult.Text>
          <Ult.Button
            style = {_styles.selectTextButton}
            onPress={this._onPressCopySelectedText}>
            <Ult.Text>
              {'Copy selected.'}
            </Ult.Text>
          </Ult.Button>
          <Ult.Text style={_styles.testSelectText}>
            {'Copied selected text:'}
          </Ult.Text>
          <Ult.Text style={_styles.testSelectText}>
            {this.state.selectedText}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  private _onPressTest5 = () => {
    let newIndex = (this.state.test5ColorIndex + 1) % _dynamicColors.length;
    this.setState({test5ColorIndex: newIndex});
  }

  private _onPressCopySelectedText = () => {
    if (this._selectionText) {
      var selectedText: string = '';
      // TODO Enable when ULT dependency is updated.
      // selectedText = this._selectionText.getSelectedText();
      this.setState({selectedText: selectedText});
    }
  }
}

class TextTest implements Test {
  getPath(): string {
    return 'Components/Text';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <TextView ref={onMount}/>;
  }
}

export default new TextTest();
