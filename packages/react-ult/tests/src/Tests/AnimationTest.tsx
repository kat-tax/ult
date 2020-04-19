/*
* Tests the animation functionality in an automated manner.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {AutoExecutableTest, TestResult, TestType} from '../Test';

const _styles = {
  container: Ult.Styles.View({
    flex: 1,
    alignSelf: 'stretch',
    flexDirection: 'column',
    alignItems: 'flex-start'
  }),
  explainTextContainer: Ult.Styles.View({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 12
  }),
  button: Ult.Styles.Button({
    marginLeft: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8
  }),
  buttonText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize
  }),
  explainText: Ult.Styles.Text({
    flex: -1,
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  animationCanvas: Ult.Styles.View({
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: 120,
    margin: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  animatedImage: Ult.Styles.Image({
    height: 100,
    width: 100
  }),
  animatedViewTest2: Ult.Styles.View({
    height: 40,
    width: 40,
    backgroundColor: 'red'
  }),
  animatedText: Ult.Styles.Text({
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: 'blue'
  }),
  animatedViewTest4: Ult.Styles.View({
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: 'green'
  }),
  limitBox: Ult.Styles.View({
    width: 1,
    height: 40,
    backgroundColor: 'black'
  })
};

const _test1Radius = 40;
const _test2Duration = 500;
const _test4Duration = 1000;

interface AnimationViewState {
  isAutoRunning?: boolean;
  isRunningTest1?: boolean;
  isRunningTest2?: boolean;
  isRunningTest3?: boolean;
  isRunningTest4?: boolean;
}

const _testValue1 = 'A long test value for the text input box';

class AnimationView extends Ult.Component<Ult.CommonProps, AnimationViewState> {
  private _isMounted = false;
  private _testResult: TestResult | undefined;
  private _testCompletion: ((result: TestResult) => void) | undefined;
  private _nextTestStage = 0;

  // Test 1 animation variables
  private _test1Angle = 0;
  private _test1OffsetH = new Ult.Animated.Value(_test1Radius);
  private _test1OffsetV = new Ult.Animated.Value(0);
  private _test1Animation = Ult.Styles.AnimatedImage({
    transform: [{
      translateX: this._test1OffsetH
    }, {
      translateY: this._test1OffsetV
    }]
  });

  // Test 2 animation variables
  private _test2OffsetH = new Ult.Animated.Value(-100);
  private _test2Color = new Ult.Animated.Value(0);
  private _test2Animation = Ult.Styles.AnimatedView({
    transform: [{
      translateX: this._test2OffsetH
    }],
    backgroundColor: Ult.Animated.interpolate(
      this._test2Color,
      [0, 0.5, 1],
      ['red', 'blue', 'green']
    )
  });

  // Test 3 animation variables
  private _test3Angle = new Ult.Animated.Value(0);
  private _test3Animation = Ult.Styles.AnimatedText({
    transform: [{
      rotate: Ult.Animated.interpolate(this._test3Angle, [0, 1], ['0deg', '360deg'])
    }, {
      rotateZ: Ult.Animated.interpolate(this._test3Angle, [0, 1], ['0deg', '90deg'])
    }]
  });

  // Test 4 animation variables
  private _test4OffsetH = new Ult.Animated.Value(-100);
  private _test4Animation = Ult.Styles.AnimatedView({
    transform: [{
      translateX: this._test4OffsetH
    }]
  });

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      isAutoRunning: false,
      isRunningTest1: false,
      isRunningTest2: false,
      isRunningTest3: false,
      isRunningTest4: false
    };
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
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'A simple animation driven by JavaScript code.'}
          </Ult.Text>
          <Ult.Button
            style={_styles.button}
            onPress={this._runTest1}
            disabled={this.state.isAutoRunning || this.state.isRunningTest1}>
            <Ult.Text style={_styles.buttonText}>
              {'Animate'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
        <Ult.View style={_styles.animationCanvas}>
          <Ult.Animated.Image
            source={'https://microsoft.github.io/reactxp/img/tests/bulb.jpg'}
            resizeMode={'contain'}
            style={[_styles.animatedImage, this._test1Animation]}
          />
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Animation of translation and color using parallel and serial animations.'}
          </Ult.Text>
          <Ult.Button
            style={_styles.button}
            onPress={this._runTest2}
            disabled={this.state.isAutoRunning || this.state.isRunningTest2}>
            <Ult.Text style={_styles.buttonText}>
              {'Animate'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
        <Ult.View style={_styles.animationCanvas}>
          <Ult.Animated.View style={[_styles.animatedViewTest2, this._test2Animation]}/>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Rotation animation that uses 250ms delay and loop.'}
          </Ult.Text>
          <Ult.Button
            style={_styles.button}
            onPress={this._runTest3}
            disabled={this.state.isAutoRunning || this.state.isRunningTest3}>
            <Ult.Text style={_styles.buttonText}>
              {'Animate'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
        <Ult.View style={_styles.animationCanvas}>
          <Ult.Animated.Text
            style={[_styles.animatedText, this._test3Animation]}>
            {'Cool Rotation!'}
          </Ult.Animated.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'Animation that is interrupted. It should move halfway to the black line and back.'}
          </Ult.Text>
          <Ult.Button
            style={_styles.button}
            onPress={this._runTest4}
            disabled={this.state.isAutoRunning || this.state.isRunningTest4}>
            <Ult.Text style={_styles.buttonText}>
              {'Animate'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
        <Ult.View style={_styles.animationCanvas}>
          <Ult.Animated.View style={[_styles.animatedViewTest4, this._test4Animation]}/>
          <Ult.View style={_styles.limitBox} />
        </Ult.View>
      </Ult.View>
    );
  }

  private _executeNextStage() {
    // If we're not running in "auto" mode, don't run the next stage.
    if (!this.state.isAutoRunning) return;

    const testStages: (() => void)[] = [() => {
      this._runTest1();
    }, () => {
      this._runTest2();
    }, () => {
      this._runTest3();
    }, () => {
      this._runTest4();
    }];

    // Are we done?
    if (this._nextTestStage! >= testStages.length) {
      this._testCompletion!(this._testResult!);
      this._testCompletion = undefined;
      this._testResult = undefined;
      if (this._isMounted) {
        this.setState({isAutoRunning: false});
      }
    } else {
      // Run the next stage after a brief delay.
      _.delay(() => {
        testStages[this._nextTestStage]();
        this._nextTestStage++;
      }, 200);
    }
  }

  private _runTest1 = () => {
    this._test1Angle = 0;
    this.setState({isRunningTest1: true});

    let setNextValues = () => {
      // Are we done?
      if (this._test1Angle >= 2 * Math.PI) {
        if (this._isMounted) {
          this.setState({isRunningTest1: false});
        }
        this._executeNextStage();
        return;
      }

      // Update the values.
      this._test1OffsetH.setValue(_test1Radius * Math.cos(this._test1Angle));
      this._test1OffsetV.setValue(_test1Radius * Math.sin(this._test1Angle));
      this._test1Angle += 2 * Math.PI / 36;
      _.delay(() => {
        setNextValues();
      }, 1000 / 60);
    };
    setNextValues();
  }

  private _runTest2 = () => {
    this.setState({isRunningTest2: true});
    let animation = Ult.Animated.sequence([
      Ult.Animated.parallel([
        Ult.Animated.timing(this._test2Color, {
          toValue: 1,
          duration: _test2Duration,
          easing: Ult.Animated.Easing.InOut()
        }),
        Ult.Animated.timing(this._test2OffsetH, {
          toValue: 100,
          duration: _test2Duration,
          easing: Ult.Animated.Easing.Linear()
        })
      ]),
      Ult.Animated.parallel([
        Ult.Animated.timing(this._test2Color, {
          toValue: 0,
          duration: _test2Duration,
          easing: Ult.Animated.Easing.InOut()
        }),
        Ult.Animated.timing(this._test2OffsetH, {
          toValue: -100,
          duration: _test2Duration,
          easing: Ult.Animated.Easing.Linear()
        })
      ])
    ]);

    animation.start(() => {
      if (this._isMounted) {
        this.setState({isRunningTest2: false});
      }
      this._executeNextStage();
    });
  }

  private _runTest3 = () => {
    this.setState({isRunningTest3: true});
    let animation = Ult.Animated.timing(this._test3Angle, {
      toValue: 1,
      duration: 250,
      easing: Ult.Animated.Easing.Linear(),
      delay: 250,
      loop: {
        restartFrom: 0
      }
    });

    animation.start();

    // Allow it to run for a while.
    _.delay(() => {
      animation.stop();
      this._test3Angle.setValue(0);
      if (this._isMounted) {
        this.setState({isRunningTest3: false});
      }
      this._executeNextStage();
    }, 2000);
  }

  private _runTest4 = () => {
    this.setState({isRunningTest4: true});
    let animation = Ult.Animated.timing(this._test4OffsetH, {
      toValue: 0,
      duration: _test4Duration,
      easing: Ult.Animated.Easing.Linear()
    });

    let isFinished: boolean|undefined;
    let wasCompletionCalled = false;
    animation.start(completeInfo => {
      if (isFinished !== undefined) {
        this._testResult!.errors.push('Completion callback "finished" called multiple times');
      }
      isFinished = completeInfo.finished;
      wasCompletionCalled = true;
    });

    // Set a timer for half-way through the animation. This will
    // stop the animation and start it again in the opposite direction.
    _.delay(() => {
      if (this._isMounted) {
        animation.stop();

        // Make sure the completion was executed and the "finished" parameter was false.
        if (!wasCompletionCalled) {
          this._testResult!.errors.push('Completion callback was not called when animation was stopped');
        } else if (isFinished === undefined || isFinished !== false) {
          this._testResult!.errors.push('Completion callback "finished" parameter was not false as expected');
        }

        Ult.Animated.timing(this._test4OffsetH, {
          toValue: -100,
          duration: _test4Duration / 2,
          easing: Ult.Animated.Easing.Linear()
        }).start(completeInfo => {
          if (!completeInfo.finished) {
            this._testResult!.errors.push('Completion callback "finished" parameter was not true as expected');
          }
          if (this._isMounted) {
            this.setState({isRunningTest4: false});
          }
          this._executeNextStage();
        });
      }
    }, _test4Duration / 2);
  }

  execute(complete: (result: TestResult) => void): void {
    this._nextTestStage = 0;
    this._testResult = new TestResult();
    this._testCompletion = complete;
    this.setState({isAutoRunning: true});
    // Kick off the first stage. Defer to make sure
    // setState above has taken effect.
    _.defer(() => {
      this._executeNextStage();
    });
  }
}

class AnimationTest implements AutoExecutableTest {
  getPath(): string {
    return 'APIs/Animation';
  }

  getTestType(): TestType {
    return TestType.AutoExecutable;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <AnimationView ref={onMount}/>;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let animationView = component as AnimationView;
    animationView.execute(complete);
  }
}

export default new AnimationTest();
