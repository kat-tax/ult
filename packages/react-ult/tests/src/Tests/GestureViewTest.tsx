/*
* Tests the functionality of a GestureView component
* through user interaction.
*/

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
  gestureView: Ult.Styles.View({
    alignSelf: 'stretch',
    height: 150,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  smallBox: Ult.Styles.View({
    height: 50,
    width: 50,
    backgroundColor: 'blue'
  }),
  button: Ult.Styles.Button({
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4
  }),
  modalDialog: Ult.Styles.Text({
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  modalBox1: Ult.Styles.Text({
    padding: 20,
    backgroundColor: '#eee',
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  modalText: Ult.Styles.View({
    margin: 8
  })
};

const _colors = ['red', 'green', 'blue'];
const _shades = ['#000', '#333', '#666', '#999', '#CCC', '#FFF'];
const modal1Id = 'modal1';

interface GestureViewState {
  test1ColorIndex: number;
  test2ColorIndex: number;
  test3ColorIndex: number;
  test4ColorIndex: number;
}

class GestureViewView extends Ult.Component<Ult.CommonProps, GestureViewState> {
  private _test1RotateValue = new Ult.Animated.Value(0);
  private _test1ScaleNumericValue = 1;
  private _test1ScaleValue = new Ult.Animated.Value(1);
  private _test1AnimatedStyle = Ult.Styles.AnimatedView({
    transform: [{
      scale: this._test1ScaleValue
    }, {
      rotate: this._test1RotateValue.interpolate({
        inputRange: [0, 360],
        outputRange: ['0deg', '360deg']
      }),
    }]
  });

  private _test2HorizontalOffset = new Ult.Animated.Value(0);
  private _test2VerticalOffset = new Ult.Animated.Value(0);
  private _test2AnimatedStyle = Ult.Styles.AnimatedView({
    transform: [{
      translateX: this._test2HorizontalOffset
    }, {
      translateY: this._test2VerticalOffset
    }]
  });

  private _test3HorizontalOffset = new Ult.Animated.Value(0);
  private _test3VerticalOffset = new Ult.Animated.Value(0);
  private _test3AnimatedStyle = Ult.Styles.AnimatedView({
    transform: [{
      translateX: this._test3HorizontalOffset
    }, {
      translateY: this._test3VerticalOffset
    }]
  });

  private _test4HorizontalOffset = new Ult.Animated.Value(0);
  private _test4VerticalOffset = new Ult.Animated.Value(0);
  private _test4AnimatedStyle = Ult.Styles.AnimatedView({
    transform: [{
      translateX: this._test4HorizontalOffset
    }, {
      translateY: this._test4VerticalOffset
    }]
  });

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      test1ColorIndex: 0,
      test2ColorIndex: 1,
      test3ColorIndex: 2,
      test4ColorIndex: 3
    };
  }

  render() {
    // Create dynamic styles.
    let test1ColorStyle = Ult.Styles.View({
      backgroundColor: _colors[this.state.test1ColorIndex]
    }, false);

    let test2ColorStyle = Ult.Styles.View({
      backgroundColor: _colors[this.state.test2ColorIndex]
    }, false);

    let test3ColorStyle = Ult.Styles.View({
      backgroundColor: _colors[this.state.test3ColorIndex]
    }, false);

    let test4ColorStyle = Ult.Styles.View({
      backgroundColor: _shades[this.state.test4ColorIndex]
    }, false);

    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Pinch-and-zoom and rotate gestures will grow and rotate the square (touch only). ' +
              'Scroll wheel will grow the square (mouse). ' +
              'Double-tap/click will change the color.'}
          </Ult.Text>
        </Ult.View>
        <Ult.GestureView
          style={_styles.gestureView}
          onPinchZoom={state => this._onPinchZoomTest1(state)}
          onRotate={state => this._onRotateTest1(state)}
          onDoubleTap={state => this._onDoubleTapTest1(state)}
          mouseOverCursor={Ult.Types.GestureMouseCursor.Pointer}
          onScrollWheel={state => this._onScrollWheelTest1(state)}
          testId={'gestureView1'}>
          <Ult.Animated.View
            style={[_styles.smallBox, test1ColorStyle, this._test1AnimatedStyle]}
          />
        </Ult.GestureView>

        <Ult.View style={_styles.explainTextContainer } key={'explanation2'}>
          <Ult.Text style={_styles.explainText }>
            {'Horizontal and vertical panning (or dragging) will move the square. ' +
              'Single tap/click will change the color.'}
          </Ult.Text>
        </Ult.View>
        <Ult.GestureView
          style={_styles.gestureView}
          onTap={state => this._onTapTest2(state)}
          onPanHorizontal={state => this._onPanHorizontalTest2(state)}
          onPanVertical={state => this._onPanVerticalTest2(state)}
          preferredPan={Ult.Types.PreferredPanGesture.Vertical}
          mouseOverCursor={Ult.Types.GestureMouseCursor.Grab}>
          <Ult.Animated.View
            style={[_styles.smallBox, test2ColorStyle, this._test2AnimatedStyle]}
          />
        </Ult.GestureView>

        <Ult.View style={_styles.explainTextContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Panning and dragging will move the square (20-pixel threshold). ' +
              'Long-pressing will change the color.'}
          </Ult.Text>
        </Ult.View>
        <Ult.GestureView
          style={_styles.gestureView}
          onPan={state => this._onPanTest3(state)}
          onLongPress={this._onLongPressTest3}
          panPixelThreshold={20}
          mouseOverCursor={Ult.Types.GestureMouseCursor.Grab}>
          <Ult.Animated.View
            style={[_styles.smallBox, test3ColorStyle, this._test3AnimatedStyle]}
          />
        </Ult.GestureView>
        <Ult.View style={_styles.explainTextContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'Desktop platforms: Left click will make the box lighter. ' +
              'Right click (context menu) will make the box darker.'}
          </Ult.Text>
        </Ult.View>
        <Ult.GestureView
          style={_styles.gestureView}
          onTap={state => this._onTapTest4(state)}
          onContextMenu={e => this._onContextMenu4(e)}
          mouseOverCursor={Ult.Types.GestureMouseCursor.Pointer}>
          <Ult.Animated.View
            style={[_styles.smallBox, test4ColorStyle, this._test4AnimatedStyle]}
          />
        </Ult.GestureView>
        <Ult.View style={_styles.explainTextContainer} key={'explanation5'}>
          <Ult.Button style={_styles.button} onPress={this._onShowModal}>
            <Ult.Text style={_styles.explainText}>
              {'Show Modal Dialog'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
      </Ult.View>
    );
  }

  private _onShowModal = (e: Ult.Types.SyntheticEvent) => {
    e.stopPropagation();
    Ult.Modal.show((
      <Ult.View style={_styles.modalDialog}>
        <Ult.View style={_styles.modalBox1} onPress={this._onDismissDialog}>
        <Ult.Text style={_styles.modalText}>
            {'Gesture targets should be disabled'}
          </Ult.Text>
          <Ult.Text style={_styles.modalText}>
            {'Click here to dismiss dialog'}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    ),
    modal1Id);
  }

  private _onDismissDialog = (e: Ult.Types.SyntheticEvent) => {
    Ult.Modal.dismiss(modal1Id);
  }

  private _onPinchZoomTest1(state: Ult.Types.MultiTouchGestureState) {
    // Determine ratio of distance to initial distance.
    let zoomRatio = state.distance / state.initialDistance;

    // Clamp to range [0.25, 2].
    zoomRatio = Math.max(Math.min(zoomRatio, 2), 0.25);
    this._test1ScaleNumericValue = zoomRatio;
    this._test1ScaleValue.setValue(zoomRatio);
  }

  private _onRotateTest1(state: Ult.Types.MultiTouchGestureState) {
    let relativeAngle = state.angle - state.initialAngle;

    this._test1RotateValue.setValue(relativeAngle);
  }

  private _onDoubleTapTest1(state: Ult.Types.TapGestureState) {
    // Change the color.
    this.setState({
      test1ColorIndex: (this.state.test1ColorIndex + 1) % _colors.length
    });
  }

  private _onScrollWheelTest1(state: Ult.Types.ScrollWheelGestureState) {
    let zoomRatio = this._test1ScaleNumericValue;
    zoomRatio *= Math.pow(1.01, state.scrollAmount);
    zoomRatio = Math.max(Math.min(zoomRatio, 2), 0.25);
    this._test1ScaleNumericValue = zoomRatio;
    this._test1ScaleValue.setValue(zoomRatio);
  }

  private _onTapTest2(gestureState: Ult.Types.TapGestureState) {
    // Change the color.
    this.setState({
      test2ColorIndex: (this.state.test2ColorIndex + 1) % _colors.length
    });
  }

  private _onPanHorizontalTest2(state: Ult.Types.PanGestureState) {
    if (state.isComplete) {
      this._test2HorizontalOffset.setValue(0);
    } else {
      this._test2HorizontalOffset.setValue(state.pageX - state.initialPageX);
    }
  }

  private _onPanVerticalTest2(state: Ult.Types.PanGestureState) {
    if (state.isComplete) {
      this._test2VerticalOffset.setValue(0);
    } else {
      this._test2VerticalOffset.setValue(state.pageY - state.initialPageY);
    }
  }

  private _onPanTest3(state: Ult.Types.PanGestureState) {
    if (state.isComplete) {
      this._test3HorizontalOffset.setValue(0);
      this._test3VerticalOffset.setValue(0);
    } else {
      this._test3HorizontalOffset.setValue(state.pageX - state.initialPageX);
      this._test3VerticalOffset.setValue(state.pageY - state.initialPageY);
    }
  }

  private _onLongPressTest3 = (state: Ult.Types.TapGestureState) => {
    // Change the color.
    this.setState({
      test3ColorIndex: (this.state.test3ColorIndex + 1) % _colors.length
    });
  }

  private _onTapTest4(gestureState: Ult.Types.TapGestureState) {
    // Change the color.
    this.setState({
      test4ColorIndex: Math.min(this.state.test4ColorIndex + 1, _shades.length - 1)
    });
  }

  private _onContextMenu4(gestureState: Ult.Types.TapGestureState) {
    this.setState({
      test4ColorIndex: Math.max(this.state.test4ColorIndex - 1, 0)
    });
  }
}

class GestureViewTest implements Test {
  useFullScreenContainer = true;

  getPath(): string {
    return 'Components/GestureView';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <GestureViewView ref={onMount}/>;
  }
}

export default new GestureViewTest();
