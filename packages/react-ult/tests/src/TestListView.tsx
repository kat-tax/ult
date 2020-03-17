/*
* A view that includes a list of all tests, allowing the user to
* select or deselect particular tests and run them.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from './CommonStyles';
import {Test, TestResult, TestType} from './Test';
import TestRegistry from './TestRegistry';

const _styles = {
  container: Ult.Styles.View({
    flex: 1,
    alignSelf: 'stretch'
  }),
  header: Ult.Styles.View({
    alignSelf: 'stretch',
    flex: 0,
    backgroundColor: CommonStyles.headerBackgroundColor,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: CommonStyles.headerBorderColor
  }),
  headerSpacer: Ult.Styles.View({
    paddingTop: 20
  }),
  button: Ult.Styles.Button({
    flex: 0,
    margin: 8,
    height: 28,
    backgroundColor: CommonStyles.buttonBackgroundColor,
    borderRadius: CommonStyles.buttonBorderRadius,
    borderWidth: CommonStyles.buttonBorderWidth,
    borderColor: CommonStyles.buttonBorderColor
  }),
  buttonText: Ult.Styles.Text({
    fontSize: CommonStyles.buttonFontSize,
    marginHorizontal: 12,
    color: CommonStyles.buttonTextColor
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    marginHorizontal: 12,
    color: CommonStyles.explainTextColor
  }),
  scrollView: Ult.Styles.ScrollView({
    flex: 1,
    alignSelf: 'stretch'
  }),
  itemContainer: Ult.Styles.View({
    alignSelf: 'stretch',
    justifyContent: 'center',
    height: 32,
    cursor: 'pointer'
  }),
  itemTextContainer: Ult.Styles.View({
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center'
  }),
  resultContainer: Ult.Styles.View({
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 12
  }),
  itemText: Ult.Styles.Text({
    flex: 1,
    fontSize: CommonStyles.generalFontSize,
    marginHorizontal: 12
  }),
  notRunText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  errorText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.errorTextColor
  }),
  warningText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.warningTextColor
  }),
  successText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.successTextColor
  })
};

export interface TestListViewProps extends Ult.CommonProps {
  onSelectTest: (path: string) => void;
  onRunAll: () => void;
}

export interface TestListViewState {
  results?: {[path: string]: TestResult };
}

export class TestListView extends Ult.Component<TestListViewProps, TestListViewState> {
  constructor(props: TestListViewProps) {
    super(props);
    this.state = {
      results: {}
    };
  }

  render() {
    let tests = TestRegistry.getAllTests();
    let testListItems: JSX.Element[] = _.map(tests, (test, path) => {
      let testPath = test.getPath();
      let testType = test.getTestType();
      let result = TestRegistry.getResult(testPath);
      let resultText: JSX.Element;

      if (!result) {
        resultText = (
          <Ult.Text style={_styles.notRunText} numberOfLines={1}>
            {'not run'}
          </Ult.Text>
        );
      } else if (result.errors.length > 0) {
        resultText = (
          <Ult.Text style={_styles.errorText} numberOfLines={1}>
            {result.errors.length + (result.errors.length > 1 ? ' errors' : ' error')}
          </Ult.Text>
        );
      } else if (testType === TestType.Interactive && !result.userValidated) {
        resultText = (
          <Ult.Text style={_styles.warningText} numberOfLines={1}>
            {'needs validation'}
          </Ult.Text>
        );
      } else {
        resultText = (
          <Ult.Text style={_styles.successText} numberOfLines={1}>
            {testType === TestType.Interactive ? 'validated' : 'success'}
          </Ult.Text>
        );
      }

      return (
        <Ult.View
          style={_styles.itemContainer}
          key={path}
          onPress={() => this._onPressItem(testPath)}>
          <Ult.View style={_styles.itemTextContainer}>
            <Ult.Text style={_styles.itemText} numberOfLines={1}>
              {TestRegistry.formatPath(test.getPath())}
            </Ult.Text>
            <Ult.View style={_styles.resultContainer}>
              {resultText}
            </Ult.View>
          </Ult.View>
        </Ult.View>
      );
    });

    return (
      <Ult.View useSafeInsets={true} style={_styles.container}>
        <Ult.View style={[_styles.header, Ult.StatusBar.isOverlay() ? _styles.headerSpacer : undefined]}>
          <Ult.Text style={_styles.explainText}>
            {'Select test to run'}
          </Ult.Text>
          <Ult.Button style={_styles.button} onPress={this._runAll}>
            <Ult.Text style={_styles.buttonText}>
              {'Run All'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
        <Ult.ScrollView style={_styles.scrollView}>
          {testListItems}
        </Ult.ScrollView>
      </Ult.View>
    );
  }

  private _onPressItem(path: string) {
    this.props.onSelectTest(path);
  }

  private _runAll = (e: Ult.Types.SyntheticEvent) => {
    this.props.onRunAll();
  }
}
