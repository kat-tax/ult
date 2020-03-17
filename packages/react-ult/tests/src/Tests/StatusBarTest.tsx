/*
* Tests the Ult.StatusBar APIs in an interactive manner.
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
  labelContainer: Ult.Styles.View({
    alignSelf: 'center',
    margin: 8
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  labelText: Ult.Styles.Text({
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  }),
  button: Ult.Styles.Button({
    backgroundColor: '#ddd',
    borderWidth: 1,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderColor: 'black'
  }),
  buttonText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  buttonBank: Ult.Styles.View({
    flexDirection: 'row'
  })
};

interface StatusBarViewState {
  isStatusBarHidden: boolean;
  barStyle: 'default' | 'light-content' | 'dark-content';
  isNetworkVisible: boolean;
  backgroundColorIndex: number;
  isTranslucent: boolean;
}

class StatusBarView extends Ult.Component<Ult.CommonProps, StatusBarViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      isStatusBarHidden: false,
      barStyle: 'default',
      isNetworkVisible: true,
      backgroundColorIndex: 0,
      isTranslucent: false
    };
  }

  componentWillUnmount() {
    // Reset the status bar state.
    Ult.StatusBar.setHidden(false, 'fade');
    Ult.StatusBar.setBarStyle('default', true);
    Ult.StatusBar.setNetworkActivityIndicatorVisible(true);
    Ult.StatusBar.setBackgroundColor('black', true);
    Ult.StatusBar.setTranslucent(false);
  }

  render() {
    let styles = ['default', 'light-content', 'dark-content'];
    let styleButtons = styles.map(style => {
      return (
        <Ult.Button
          key={style}
          style={_styles.button}
          onPress={() => this._setStatusBarStyle(style as any)}
          disabled={this.state.barStyle === style}>
          <Ult.Text style={_styles.buttonText}>
            {style}
          </Ult.Text>
        </Ult.Button>
      );
    });

    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Is the status bar an "overlay" type (as on iOS)?'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer} key={'platform'}>
          <Ult.Text style={_styles.labelText}>
            {Ult.StatusBar.isOverlay() ? 'Overlay' : 'Not Overlay'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Press button to hide and show the status bar.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={() => this._toggleStatusBar('fade')}>
          <Ult.Text style={_styles.buttonText}>
            {this.state.isStatusBarHidden ? 'Show (Fade)' : 'Hide (Fade)'}
          </Ult.Text>
        </Ult.Button>
        <Ult.Button
          style={_styles.button}
          onPress={() => this._toggleStatusBar('slide')}>
          <Ult.Text style={_styles.buttonText}>
            {this.state.isStatusBarHidden ? 'Show (Slide)' : 'Hide (Slide)'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.textContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'Press buttons to change the status bar style.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.buttonBank}>
          {styleButtons}
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation5'}>
          <Ult.Text style={_styles.explainText}>
            {'Press button to toggle the network activity indicator (iOS only).'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={() => this._toggleNetworkIndicator()}>
          <Ult.Text style={_styles.buttonText}>
            {this.state.isNetworkVisible ? 'Hide Network Indicator' : 'Show Network Indicator'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.textContainer} key={'explanation6'}>
          <Ult.Text style={_styles.explainText}>
            {'Press button to change the background color of the status bar (Android only).'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={() => this._changeBackgroundColor()}>
          <Ult.Text style={_styles.buttonText}>
            {'Change Background Color'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.textContainer} key={'explanation7'}>
          <Ult.Text style={_styles.explainText}>
            {'Press button to toggle between transluscent and opaque (Android only).'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={() => this._toggleTranslucent()}>
          <Ult.Text style={_styles.buttonText}>
            {'Make ' + (this.state.isTranslucent ? 'Opaque' : 'Translucent')}
          </Ult.Text>
        </Ult.Button>
      </Ult.View>
    );
  }

  private _toggleStatusBar(effect: 'fade' | 'slide') {
    Ult.StatusBar.setHidden(!this.state.isStatusBarHidden, effect);
    this.setState({isStatusBarHidden: !this.state.isStatusBarHidden});
  }

  private _setStatusBarStyle(style: 'default' | 'light-content' | 'dark-content') {
    Ult.StatusBar.setBarStyle(style, true);
    this.setState({barStyle: style});
  }

  private _toggleNetworkIndicator() {
    Ult.StatusBar.setNetworkActivityIndicatorVisible(!this.state.isNetworkVisible);
    this.setState({isNetworkVisible: !this.state.isNetworkVisible});
  }

  private _changeBackgroundColor() {
    let colors = ['black', 'white', 'green', 'blue', 'red'];
    let newIndex = (this.state.backgroundColorIndex + 1) % colors.length;
    Ult.StatusBar.setBackgroundColor(colors[newIndex], true);
    this.setState({backgroundColorIndex: newIndex});
  }

  private _toggleTranslucent() {
    Ult.StatusBar.setTranslucent(!this.state.isTranslucent);
    this.setState({isTranslucent: !this.state.isTranslucent});
  }
}

class StatusBarTest implements Test {
  getPath(): string {
    return 'APIs/StatusBar';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <StatusBarView ref={onMount}/>;
  }
}

export default new StatusBarTest();
