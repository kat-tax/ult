/*
* A visual container for an individual test. It includes
* UI elements for executing the test and for reporting status.
*/

import Ult = require('react-ult');
import * as CommonStyles from './CommonStyles';
import {AutoExecutableTest, TestResult, TestType} from './Test';
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
  titleText: Ult.Styles.Text({
    flex: -1,
    fontSize: CommonStyles.buttonFontSize,
    marginHorizontal: 12
  }),
  resultContainer: Ult.Styles.View({
    height: 100,
    alignSelf: 'stretch',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  }),
  resultScrollView: Ult.Styles.ScrollView({
    flex: 1,
    alignSelf: 'stretch'
  }),
  resultItem: Ult.Styles.View({
    marginHorizontal: 12,
    marginTop: 8
  }),
  notRunText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  errorText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.errorTextColor
  }),
  successText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.successTextColor
  }),
  fullScreenContainer: Ult.Styles.View({
    flex: 1,
    alignSelf: 'stretch'
  })
};

export interface TestContainerProps extends Ult.CommonProps {
  test: string;
  prevResult?: TestResult;
  autoRun: boolean;
  onBack: () => void;
}

export interface TestContainerState {
  mountedComponent?: any;
  isTestRunning?: boolean;
  result?: TestResult;
}

export class TestContainer extends Ult.Component<TestContainerProps, TestContainerState> {
  constructor(props: TestContainerProps) {
    super(props);
    this.state = {
      mountedComponent: undefined,
      isTestRunning: false
    };
  }

  componentDidUpdate(prevProps: TestContainerProps, prevState: TestContainerState) {
    if (this.props.autoRun) {
      if (!prevState.isTestRunning && !this.state.isTestRunning) {
        this._executeTest();
      }
    }
  }

  render() {
    let test = TestRegistry.getTest(this.props.test);
    let testType = test.getTestType();
    let result = this.state.result || this.props.prevResult;
    let resultText: JSX.Element[] = [];
    if (!result) {
      resultText.push(
        <Ult.View style={_styles.resultItem} key='notrun'>
          <Ult.Text style={_styles.notRunText}>
            {this.state.isTestRunning ? 'Test is running' : 'Test not run'}
          </Ult.Text>
        </Ult.View>
      );
    } else {
      result.errors.forEach((error, index) => {
        resultText.push(
          <Ult.View style={_styles.resultItem} key={'error' + index}>
            <Ult.Text style={_styles.errorText}>
              {error}
            </Ult.Text>
          </Ult.View>
        );
      });

      if (resultText.length === 0) {
        resultText.push(
          <Ult.View style={_styles.resultItem} key={'success'}>
            <Ult.Text style={_styles.successText}>
              {'Test succeeded'}
            </Ult.Text>
          </Ult.View>
        );
      }
    }

    // Include results if it's not a render-only test.
    let optionalResultSection: JSX.Element | undefined;
    if (testType === TestType.AutoExecutable) {
      optionalResultSection = (
        <Ult.View style={_styles.resultContainer}>
          <Ult.ScrollView style={_styles.resultScrollView}>
            {resultText}
          </Ult.ScrollView>
        </Ult.View>
      );
    }

    let rightButton: JSX.Element;
    if (testType === TestType.Interactive) {
      rightButton = (
        <Ult.Button
          style={_styles.button}
          onPress={this._onCompleteInteractiveTest}>
          <Ult.Text style={_styles.buttonText}>
            {'Validate'}
          </Ult.Text>
        </Ult.Button>
      );
    } else {
      rightButton = (
        <Ult.Button
          style={_styles.button}
          onPress={this._onRunTest}
          disabled={this.state.isTestRunning || testType !== TestType.AutoExecutable}>
          <Ult.Text style={_styles.buttonText}>
            {'Run'}
          </Ult.Text>
        </Ult.Button>
      );
    }

    let renderedTest = test.render(this._onMountTestUI);
    let testContainer: JSX.Element;

    if (test.useFullScreenContainer) {
      testContainer = (
        <Ult.View style={_styles.fullScreenContainer}>
          {renderedTest}
        </Ult.View>
      );
    } else {
      testContainer = (
        <Ult.ScrollView>
          <Ult.View>
            {renderedTest}
          </Ult.View>
        </Ult.ScrollView>
      );
    }

    return (
      <Ult.View useSafeInsets={true} style={_styles.container}>
        <Ult.View style={[_styles.header, Ult.StatusBar.isOverlay() ? _styles.headerSpacer : undefined]}>
          <Ult.Button
            style={_styles.button}
            onPress={this._onBack}
            disabled={this.state.isTestRunning}>
            <Ult.Text style={_styles.buttonText}>
              {'Back'}
            </Ult.Text>
          </Ult.Button>
          <Ult.Text style={_styles.titleText} numberOfLines={1}>
            {TestRegistry.formatPath(test.getPath())}
          </Ult.Text>
          {rightButton}
        </Ult.View>
        {optionalResultSection}
        {testContainer}
      </Ult.View>
    );
  }

  private _onBack = () => {
    this.props.onBack();
  }

  private _onRunTest = () => {
    this._executeTest();
  }

  private _executeTest() {
    this.setState({isTestRunning: true});
    let test = TestRegistry.getTest(this.props.test);
    let testType = test.getTestType();

    if (testType === TestType.AutoExecutable) {
      (test as AutoExecutableTest).execute(this.state.mountedComponent, result => {
        // Record the results.
        TestRegistry.setResult(this.props.test, result);
        this.setState({isTestRunning: false, result});
        // Automatically go back.
        if (this.props.autoRun) {
          this.props.onBack();
        }
      });
    } else {
      let result = new TestResult();
      if (testType === TestType.Interactive) {
        result.userValidated = false;
        TestRegistry.setResult(this.props.test, result);
      } else {
        // For render-only tests, always report success.
        TestRegistry.setResult(this.props.test, result);
      }

      // Automatically go back.
      if (this.props.autoRun) {
        this.props.onBack();
      }
    }
  }

  private _onCompleteInteractiveTest = () => {
    // This should be called only if the test type is interactive.
    let result = new TestResult();
    result.userValidated = true;
    TestRegistry.setResult(this.props.test, result);
    this.props.onBack();
  }

  private _onMountTestUI = (component: any) => {
    // Record the mounted component. This will trigger
    // the test to run if the autoRun prop is set.
    if (component) {
      this.setState({mountedComponent: component});
    }
  }
}
