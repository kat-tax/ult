/*
* Tests the functionality of a Button component rendering
* that requires user interaction.
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
  button1: Ult.Styles.Button({
    backgroundColor: '#ddd',
    borderWidth: 1,
    margin: 20,
    padding: 12,
    borderRadius: 8,
    borderColor: 'black'
  }),
  button1Hover: Ult.Styles.Button({
    backgroundColor: '#666'
  }),
  button1Text: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  button1TextHover: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'white'
  }),
  button2: Ult.Styles.Button({
    backgroundColor: '#ddd',
    borderWidth: 1,
    margin: 20,
    padding: 12,
    borderRadius: 8,
    borderColor: 'black'
  }),
  buttonCursor: Ult.Styles.Button({
    cursor: 'default'
  }),
  button2Text: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  explainTextContainer: Ult.Styles.View({
    margin: 12
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  buttonWithLabelContainer: Ult.Styles.View({
    flexDirection: 'row'
  }),
  buttonLabelContainer: Ult.Styles.View({
    flexDirection: 'column',
    margin: 20
  }),
  labelText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  dropView: Ult.Styles.Text({
    flexDirection: 'row',
    margin: 20,
    backgroundColor: '#4575',
    borderWidth: 1,
    borderColor: '#457'
  }),
  wait: Ult.Styles.View({
    backgroundColor: 'orange',
  }),
  ready: Ult.Styles.View({
    backgroundColor: 'green',
  })
};

interface ButtonViewState {
  button1Hover: boolean;
  button4PressInCount: number;
  button4PressOutCount: number;
  button4PressCount: number;
  button5PressCount: number;
  button5LongPressCount: number;
  longPressed: boolean;
  onResponderReleaseReceived: boolean;
  onPressReceived: boolean;
}

class ButtonView extends Ult.Component<Ult.CommonProps, ButtonViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      button1Hover: false,
      button4PressInCount: 0,
      button4PressOutCount: 0,
      button4PressCount: 0,
      button5PressCount: 0,
      button5LongPressCount: 0,
      longPressed: false,
      onResponderReleaseReceived: false,
      onPressReceived: false
    };
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'This button should change in appearance when the mouse pointer is above ' +
              'it (valid only on mouse-based platforms).'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={[_styles.button1, this.state.button1Hover ? _styles.button1Hover : undefined]}
          onHoverStart={() => {this.setState({button1Hover: true })}}
          onHoverEnd={() => {this.setState({button1Hover: false })}}
          onPress={() => {/* no-op */}}
          testId={'button1'}>
          <Ult.Text style={[
            _styles.button1Text,
            this.state.button1Hover ? _styles.button1TextHover : undefined]}>
            {'Button With Hover'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.explainTextContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'This button should be disabled and respond to no clicks, presses, or hovers. ' +
              'The mouse pointer should not turn into a pointer.' +
              'The opacity of the disabled button should be its default value of 0.5'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button2}
          disabled={true}
          onLongPress={() => alert('Long press')}
          onPress={() => alert('press')}>
          <Ult.Text style={_styles.button2Text}>
            {'Disabled Button'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.explainTextContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'This button should be disabled and respond to no clicks, presses, or hovers. ' +
              'The mouse pointer should not turn into a pointer.' +
              'The opacity of the disabled button should be 0.3'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button2}
          disabled={true}
          disabledOpacity={0.3}
          onPress={() => {/* no-op */}}>
          <Ult.Text style={_styles.button2Text}>
            {'Disabled Button'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.explainTextContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'This button have a tooltip when hovering over it (mouse-based platforms only).' +
            ' It should also display an arrow cursor rather than the default pointer cursor.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={[_styles.button2, _styles.buttonCursor]}
          title={'Do you see this tooltip?'}
          onPress={() => {/* no-op */}}>
          <Ult.Text style={_styles.button2Text}>
            {'Button with tooltip'}
          </Ult.Text>
        </Ult.Button>

        <Ult.View style={_styles.explainTextContainer} key={'explanation5'}>
          <Ult.Text style={_styles.explainText}>
            {'This button should receive pressIn, pressOut and press events when you click or tap on it.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.buttonWithLabelContainer}>
          <Ult.Button
            style={_styles.button2}
            onPressIn={() => this.setState({button4PressInCount: this.state.button4PressInCount + 1})}
            onPressOut={() => this.setState({button4PressOutCount: this.state.button4PressOutCount + 1})}
            onPress={() => this.setState({button4PressCount: this.state.button4PressCount + 1})}>
            <Ult.Text style={_styles.button2Text}>
              {'Button with press'}
            </Ult.Text>
          </Ult.Button>
          <Ult.View style={_styles.buttonLabelContainer}>
            <Ult.Text style={_styles.labelText} key={'pressIn'}>
              {'PressIn count: ' + this.state.button4PressInCount}
            </Ult.Text>
            <Ult.Text style={_styles.labelText} key={'pressOut'}>
              {'PressOut count: ' + this.state.button4PressOutCount}
            </Ult.Text>
            <Ult.Text style={_styles.labelText} key={'press'}>
              {'Press count: ' + this.state.button4PressCount}
            </Ult.Text>
          </Ult.View>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation6'}>
          <Ult.Text style={_styles.explainText}>
            {'This button should differentiate between press and long-press actions. ' +
              'Click or tap and hold for more than one second for a long press.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.buttonWithLabelContainer}>
          <Ult.Button
            style={_styles.button2}
            delayLongPress={1000}
            onPress={() => this.setState({button5PressCount: this.state.button5PressCount + 1})}
            onLongPress={() => this.setState({button5LongPressCount: this.state.button5LongPressCount + 1})}>
            <Ult.Text style={_styles.button2Text}>
              {'Button with long press'}
            </Ult.Text>
          </Ult.Button>
          <Ult.View style={_styles.buttonLabelContainer}>
            <Ult.Text style={_styles.labelText} key={'press'}>
              {'Press count: ' + this.state.button5PressCount}
            </Ult.Text>
            <Ult.Text style={_styles.labelText} key={'longpress'}>
              {'Long press count: ' + this.state.button5LongPressCount}
            </Ult.Text>
          </Ult.View>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation7'}>
          <Ult.Text style={_styles.explainText}>
            {'This button should change opacity to 25% when pressing (touch-based platforms only). ' +
              'The underlay color should appear red.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button2}
          activeOpacity={0.25}
          underlayColor={'red'}
          disableTouchOpacityAnimation={false}
          onPress={() => {/* no-op */}}>
          <Ult.Text style={_styles.button2Text}>
            {'Button with opacity'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.explainTextContainer} key={'explanation8'}>
          <Ult.Text style={_styles.explainText}>
            {'This button should not exhibit any opacity animation when pressed (touch-based platforms only).'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button2}
          disableTouchOpacityAnimation={true}
          onPress={() => {/* no-op */}}>
          <Ult.Text style={_styles.button2Text}>
            {'Button with no opacity'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.explainTextContainer} key={'explanation9'}>
          <Ult.Text style={_styles.explainText}>
            Long press the button and leave it to release the touch in the blue View.
            The View should turn green when receiving the onResponderRelease (touch) or onPress (mouse) event
            only when the long press has been triggered.
          </Ult.Text>
        </Ult.View>
        <Ult.View>
          <Ult.View 
            style={[
              _styles.dropView,
              this.state.onResponderReleaseReceived
                || this.state.onPressReceived ? _styles.ready : undefined
            ]}
            onPress={() => {
              if (this.state.longPressed) {
                this.setState({onPressReceived: true});
              }
            }}
            onResponderRelease={() => {
              if (this.state.longPressed) {
                this.setState({onResponderReleaseReceived: true});
              }
            }}>
            <Ult.Button
              style={[_styles.button2, this.state.longPressed ? _styles.ready : _styles.wait]}
              onPressIn={() => this.setState({
                longPressed: false,
                onResponderReleaseReceived: false,
                onPressReceived: false
              })}
              onLongPress={() => this.setState({longPressed: true})}>
              <Ult.Text style={_styles.button2Text}>
                Long press here
              </Ult.Text>
            </Ult.Button>
            <Ult.Text style={_styles.button2Text}>
              Release here, on the parent View
            </Ult.Text>
          </Ult.View>
        </Ult.View>
      </Ult.View>
    );
  }
}

class ButtonTest implements Test {
  getPath(): string {
    return 'Components/Button';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <ButtonView ref={onMount}/>;
  }
}

export default new ButtonTest();
