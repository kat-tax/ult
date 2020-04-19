/*
* Tests mouse/touch/pointer functionality of a View component.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {Test, TestType} from '../Test';

const _styles = {
  explainTextContainer: Ult.Styles.View({
    margin: 12,
    alignItems: 'center'
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  labelText: Ult.Styles.Text({
    margin: 8,
    fontSize: CommonStyles.generalFontSize,
  }),
  testContainer1: Ult.Styles.Text({
    backgroundColor: '#eee',
    borderColor: 'black',
    borderWidth: 1,
    margin: 20,
  }),
  wrapper: Ult.Styles.View({
    flexDirection: 'row'
  }),
  testContainer2: Ult.Styles.View({
    flex: 1,
    height: 120,
    margin: 20,
    borderWidth: 1,
    backgroundColor: '#eee',
    borderColor: 'black',
  }),
  testContainer3: Ult.Styles.View({
    flex: 1,
    height: 120,
    margin: 20,
    borderWidth: 1,
    backgroundColor: '#eee',
    borderColor: 'black',
  }),
  testContainer4: Ult.Styles.View({
    flex: 1,
    height: 150,
    margin: 20,    
    borderWidth: 1,
    backgroundColor: '#eee',
    borderColor: 'black',
  }),
  testContainer5: Ult.Styles.View({
    flex: 1,
    margin: 20,
    padding: 20,
    borderWidth: 1,
    backgroundColor: '#eee',
    borderColor: 'black',
  }),
  successText: Ult.Styles.Text({
     color: 'green'
  }),
  success: Ult.Styles.View({
    borderWidth: 2,
    backgroundColor: 'green'
  })
};

interface TouchViewState {
  view2TouchResponderTestStart: boolean;
  view2TouchResponderTestGrant: boolean;
  view2TouchResponderTestRelease: boolean;
  view3TouchResponderTestStart: boolean;
  view3TouchResponderTestGrant: boolean;
  view3TouchResponderTestRelease: boolean;
  touchPositionOnPage: {
    x: number | null
    y: number | null
  };
  nestedViewTouchTestParent: boolean;
  nestedViewTouchTestChild: boolean;
  pressEvent?: Ult.Types.TouchEvent;
  didCapturedTouchIn?: boolean;
  didCapturedTouchMove?: boolean;
}

class ViewTouch extends Ult.Component<Ult.CommonProps, TouchViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      view2TouchResponderTestStart: false,
      view2TouchResponderTestGrant: false,
      view2TouchResponderTestRelease: false,
      view3TouchResponderTestStart: false,
      view3TouchResponderTestGrant: false,
      view3TouchResponderTestRelease: false,
      touchPositionOnPage: {
        x: null,
        y: null
      },
      nestedViewTouchTestParent: false,
      nestedViewTouchTestChild: false,
    };
  }

  private static getTouchEventText(touchEvent?: Ult.Types.TouchEvent): string {
    if (touchEvent) {
      return 'altKey = ' + touchEvent.altKey +
        ' changedTouches.length = ' + (touchEvent.changedTouches && touchEvent.changedTouches.length) +
        ' ctrlKey = ' + touchEvent.ctrlKey +
        ' metaKey = ' + touchEvent.metaKey +
        ' shiftKey = ' + touchEvent.shiftKey +
        ' targetTouches = ' + touchEvent.targetTouches +
        ' locationX = ' + touchEvent.locationX +
        ' locationY = ' + touchEvent.locationY +
        ' pageX = ' + touchEvent.pageX +
        ' pageY = ' + touchEvent.pageY +
        ' touches = ' + touchEvent.touches;
    }
    return 'N/A';
  }

  private isView2TouchResponderEventHasBeenAllFired = () => {
    return this.state.view2TouchResponderTestStart &&
      this.state.view2TouchResponderTestGrant && 
      this.state.view2TouchResponderTestRelease;
  }

  private isView3TouchResponderEventHasBeenAllFired = () => {
    return this.state.view3TouchResponderTestStart &&
      this.state.view3TouchResponderTestGrant && 
      this.state.view3TouchResponderTestRelease;
  }

  render(): any {
    return (
      <Ult.View>
        <Ult.View style={_styles.explainTextContainer}>
          <Ult.Text style={_styles.explainText}>
            {'The view below shows textual representation of the last mouse events it has received.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View
          style={_styles.testContainer1}
          onPress={e => this.setState({
            pressEvent: _.clone(e.nativeEvent as Ult.Types.TouchEvent)
          })}>
          <Ult.Text style={_styles.labelText}>
            {'onPress: ' + ViewTouch.getTouchEventText(this.state.pressEvent)}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer}>
          <Ult.Text style={_styles.explainText}>
            {'The two views below should turn green if they received the `StartShouldSetResponder` event.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.wrapper}>
          <Ult.View
            style={[
              _styles.testContainer2,
              this.isView2TouchResponderEventHasBeenAllFired()
                ? _styles.success
                : undefined
            ]}
            onStartShouldSetResponder={() => {
              this.setState({view2TouchResponderTestStart: true});
              return true;
            }}
            onResponderGrant={() => {
              this.setState({view2TouchResponderTestGrant: true});
            }}
            onResponderRelease={() => {
              this.setState({view2TouchResponderTestRelease: true});
            }}
          />
          <Ult.View
            style={[
              _styles.testContainer3,
              this.isView3TouchResponderEventHasBeenAllFired()
                ? _styles.success
                : undefined
            ]}
            onPress={() => null}
            onStartShouldSetResponder={() => {
              this.setState({view3TouchResponderTestStart: true});
              return true;
            }}
            onResponderGrant={() => {
              this.setState({view3TouchResponderTestGrant: true});
            }}
            onResponderRelease={() => {
              this.setState({view3TouchResponderTestRelease: true});
            }}
          />
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer}>
          <Ult.Text style={_styles.explainText}>
            {'When touching this view, it will display the page coordinates of the touch position.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View
          style={_styles.testContainer4}
          onResponderMove={e => {
            const touch = e.touches[0];
            if (touch) {
              this.setState({touchPositionOnPage: {
                x: Math.round(touch.pageX),
                y: Math.round(touch.pageY)
              }});
            }
          }}>
          <Ult.Text style={_styles.labelText}>
            {`Touch position on page: x: ${this.state.touchPositionOnPage.x} y: ${this.state.touchPositionOnPage.y}`}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer}>
          <Ult.Text style={_styles.explainText}>
            {'The view below shows textual representation of the capture phase of a touch in'}
            {'  - The text `View captured touch in` should turn green'}
            {'  - The text `View captured touch move` should turn green'}
          </Ult.Text>
        </Ult.View>
        <Ult.View
          style={_styles.testContainer5}
          onTouchStartCapture={() => this.setState({didCapturedTouchIn: true})}
          onTouchMoveCapture={() => this.setState({didCapturedTouchMove: true})}>
          <Ult.Text style={[_styles.labelText, this.state.didCapturedTouchIn ? _styles.successText : {}]}>
            View captured touch in
          </Ult.Text>
          <Ult.Text style={[_styles.labelText, this.state.didCapturedTouchMove ? _styles.successText : {}]}>
            View captured touch move
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }
}

class ViewTouchTest implements Test {
  getPath(): string {
    return 'Components/View/Touch';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <ViewTouch ref={onMount} />;
  }
}

export default new ViewTouchTest();
