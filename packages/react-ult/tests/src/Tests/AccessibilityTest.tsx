/*
* Tests the Ult.Accessibility APIs in an interactive manner.
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
  })
};

interface AccessibilityState {
  isHighContrastEnabled?: boolean;
  isScreenReaderEnabled?: boolean;
}

class AccessibilityView extends Ult.Component<Ult.CommonProps, AccessibilityState> {
  private _highContrastEvent: Ult.Types.SubscriptionToken | undefined;
  private _screenReaderEvent: Ult.Types.SubscriptionToken | undefined;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      isHighContrastEnabled: Ult.Accessibility.isHighContrastEnabled(),
      isScreenReaderEnabled: Ult.Accessibility.isScreenReaderEnabled()
    };
  }

  componentDidMount() {
    this._highContrastEvent = Ult.Accessibility.highContrastChangedEvent.subscribe(isEnabled => {
      this.setState({isHighContrastEnabled: isEnabled});
    });

    this._screenReaderEvent = Ult.Accessibility.screenReaderChangedEvent.subscribe(isEnabled => {
      this.setState({isScreenReaderEnabled: isEnabled});
    });
  }

  componentWillUnmount() {
    if (this._highContrastEvent) {
      this._highContrastEvent.unsubscribe();
    }

    if (this._screenReaderEvent) {
      this._screenReaderEvent.unsubscribe();
    }
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Is the screen reader enabled?'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.labelText}>
            {this.state.isScreenReaderEnabled ? 'Screen Reader On' : 'Screen Reader Off'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Is high-contrast mode enabled?'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.labelText}>
            {this.state.isHighContrastEnabled ? 'High Contrast On' : 'High Contrast Off'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Press button to send "Hello" to the screen reader.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button }
          onPress={() => this._sendTextToScreenReader('Hello')}>
          <Ult.Text style={_styles.buttonText}>
            {'Send "Hello" to Screen Reader'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.textContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'Validate that the screen reader reads "5, Mock Slider, Slider" when focus is on "Mock Slider" text below.'}
          </Ult.Text>
          <Ult.View
            ariaValueNow={5}
            accessibilityTraits={Ult.Types.AccessibilityTrait.Adjustable}
            accessibilityLabel={'Mock Slider'}
            tabIndex={0}>
            <Ult.Text>
              {'Mock Slider'}
            </Ult.Text>
          </Ult.View>
        </Ult.View>
      </Ult.View>
    );
  }

  private _sendTextToScreenReader(text: string) {
    Ult.Accessibility.announceForAccessibility(text);
  }
}

class AccessibilityTest implements Test {
  getPath(): string {
    return 'APIs/Accessibility';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <AccessibilityView ref={onMount} />;
  }
}

export default new AccessibilityTest();
