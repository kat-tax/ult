/*
* Tests the Ult.UserInterface APIs in an automated manner.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {AutoExecutableTest, TestResult, TestType} from '../Test';
import {approxEquals} from '../Utilities';

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
  parentContainer: Ult.Styles.View({
    marginHorizontal: 32,
    height: 100,
    width: 100,
    padding: 12,
    backgroundColor: '#eee'
  }),
  childView: Ult.Styles.View({
    height: 24,
    width: 24,
    margin: 8,
    backgroundColor: 'red'
  })
};

interface UserInterfaceState {
}

class UserInterfaceView extends Ult.Component<Ult.CommonProps, UserInterfaceState> {
  private _isMounted = false;
  private _parentView: Ult.View | undefined;
  private _childView: Ult.View | undefined;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'This test executes the various APIs in the UserInterface namespace. ' +
              'It uses the views below to test the measurement APIs.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View
          style={_styles.parentContainer}
          ref={(comp: any) => {this._parentView = comp}}>
          <Ult.View
            style={_styles.childView }
            ref={(comp: any) => {this._childView = comp}}>
          </Ult.View>
        </Ult.View>
      </Ult.View>
    );
  }

  execute(complete: (result: TestResult) => void) {
    let result = new TestResult();

    // Start by calling all of the synchronous APIs.

    // We can't call setMainView because it is called as part of
    // the app's initialization.

    // We can't call useCustomScrollbars because it must be called
    // only once before setMainView.

    // measureWindow
    let screenSize = Ult.UserInterface.measureWindow();

    // isHighPixelDensityScreen
    let isHighDensity = Ult.UserInterface.isHighPixelDensityScreen();

    // dismissKeyboard
    Ult.UserInterface.dismissKeyboard();

    // enableTouchLatencyEvents
    Ult.UserInterface.enableTouchLatencyEvents(2000);
    Ult.UserInterface.enableTouchLatencyEvents(0);

    // isNavigatingWithKeyboard
    let isUsingKeyboard = Ult.UserInterface.isNavigatingWithKeyboard();

    // Subscribe to events
    let sizeMultiplierEvent = Ult.UserInterface.contentSizeMultiplierChangedEvent.subscribe(multiplier => {
      // Nothing to do
    });
    sizeMultiplierEvent.unsubscribe();

    let touchLatencyEvent = Ult.UserInterface.touchLatencyEvent.subscribe(observedLatency => {
      // Nothing to do
    });
    touchLatencyEvent.unsubscribe();

    let keyboardNavigationEvent = Ult.UserInterface.keyboardNavigationEvent.subscribe(isNav => {
      // Nothing to do
    });
    keyboardNavigationEvent.unsubscribe();

    let parentAbsolute: Ult.Types.LayoutInfo;
    let childAbsolute: Ult.Types.LayoutInfo;
    let childRelative: Ult.Types.LayoutInfo;

    // Now execute the async APIs.
    let measureTask = Ult.UserInterface.measureLayoutRelativeToWindow(this._parentView!).then(layoutInfo => {
      parentAbsolute = layoutInfo;
      return Ult.UserInterface.measureLayoutRelativeToWindow(this._childView!);
    }).then(layoutInfo => {
      childAbsolute = layoutInfo;
      return Ult.UserInterface.measureLayoutRelativeToAncestor(this._childView!, this._parentView!);
    }).then(layoutInfo => {
      childRelative = layoutInfo;

      if (!approxEquals(parentAbsolute.width, 100) || !approxEquals(parentAbsolute.height, 100)) {
        result.errors.push(`Expected parent view to be 100x100. Got ${parentAbsolute.width}x${parentAbsolute.height}`);
      }

      if (!approxEquals(childAbsolute.width, 24) || !approxEquals(childAbsolute.height, 24)) {
        result.errors.push(`Expected child view to be 24x24. Got ${childAbsolute.width}x${childAbsolute.height}`);
      }

      const xValue = childAbsolute.x - parentAbsolute.x;
      const yValue = childAbsolute.y - parentAbsolute.y;
      if (!approxEquals(xValue, 20) || !approxEquals(yValue, 20)) {
        result.errors.push(`Expected absolute position of child view to be 20x20 from parent. Got ${xValue}x${yValue}`);
      }

      if (!approxEquals(childRelative.x, 20) || !approxEquals(childRelative.y, 20)) {
        result.errors.push(`Expected relative position of child view to be 20x20 from parent. ` +
          `Got ${childRelative.x}x${childRelative.y}`);
      }
    }).catch(err => {
      result.errors.push('Error occurred when measuring views.');
    });

    // Execute the content size multiplier API.
    let multiplierTask = Ult.UserInterface.getContentSizeMultiplier().then(mult => {
      // Nothing to do.
    }).catch(err => {
      result.errors.push('Error occurred when calling Ult.UserInterface.getContentSizeMultiplier');
    });

    // Wait for all async tasks to complete.
    Promise.all([measureTask, multiplierTask]).then(() => {
      // Mark the test as complete.
      complete(result);
    });
  }
}

class UserInterfaceTest implements AutoExecutableTest {
  getPath(): string {
    return 'APIs/UserInterface';
  }

  getTestType(): TestType {
    return TestType.AutoExecutable;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <UserInterfaceView ref={onMount}/>;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let UserInterfaceView = component as UserInterfaceView;
    UserInterfaceView.execute(complete);
  }
}

export default new UserInterfaceTest();
