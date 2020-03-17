/*
* Tests the Ult.International APIs in an interactive manner.
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

interface InternationalState {
  isRtlAllowed?: boolean;
  isRtlForced?: boolean;
}

class InternationalView extends Ult.Component<Ult.CommonProps, InternationalState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      isRtlAllowed: true,
      isRtlForced: false
    };
  }

  componentWillUnmount() {
    // Restore default values.
    if (!this.state.isRtlAllowed) {
      Ult.International.allowRTL(true);
    }

    if (this.state.isRtlForced) {
      Ult.International.forceRTL(false);
    }
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Is the app currently running in left-to-right (LTR) or right-to-left (RTL) mode?' }
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.labelText}>
            {Ult.International.isRTL() ? 'RTL' : 'LTR' }
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Is RTL allowed? This change won\'t be visible because it must be set at app start time.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={this._toggleAllowRtl}>
          <Ult.Text style={_styles.buttonText}>
            {this.state.isRtlAllowed ? 'Prevent RTL' : 'Allow RTL'}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.textContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Force the use of RTL? This change won\'t be visible because it must be set at app start time.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={this._toggleForceRtl}>
          <Ult.Text style={_styles.buttonText}>
            {this.state.isRtlForced ? 'Don\'t Force RTL' : 'Force RTL'}
          </Ult.Text>
        </Ult.Button>
      </Ult.View>
    );
  }

  private _toggleAllowRtl = () => {
    Ult.International.allowRTL(!this.state.isRtlAllowed);
    this.setState({isRtlAllowed: !this.state.isRtlAllowed});
  }

  private _toggleForceRtl = () => {
    Ult.International.forceRTL(!this.state.isRtlForced);
    this.setState({isRtlForced: !this.state.isRtlForced});
  }
}

class InternationalTest implements Test {
  getPath(): string {
    return 'APIs/International';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <InternationalView ref={onMount}/>;
  }
}

export default new InternationalTest();
