/*
* Tests the Ult.App APIs in an interactive manner.
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
  historyText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  })
};

interface AppState {
  activationState: Ult.Types.AppActivationState;
  activationHistory: string;
  memoryWarningCount: number;
}

class AppView extends Ult.Component<Ult.CommonProps, AppState> {
  private _appActivationEvent: Ult.Types.SubscriptionToken | undefined;
  private _memoryWarningEvent: Ult.Types.SubscriptionToken | undefined;

  constructor(props: Ult.CommonProps) {
    super(props);
    let curState = Ult.App.getActivationState();
    this.state = {
      activationState: curState,
      activationHistory: this._activationStateToString(curState),
      memoryWarningCount: 0
    };
  }

  componentDidMount() {
    this._appActivationEvent = Ult.App.activationStateChangedEvent.subscribe(state => {
      this.setState({
        activationState: state,
        activationHistory: this.state.activationHistory + '\n' + this._activationStateToString(state)
      });
    });

    this._memoryWarningEvent = Ult.App.memoryWarningEvent.subscribe(() => {
      this.setState({memoryWarningCount: this.state.memoryWarningCount + 1});
    });
  }

  componentWillUnmount() {
    if (this._appActivationEvent) {
      this._appActivationEvent.unsubscribe();
    }

    if (this._memoryWarningEvent) {
      this._memoryWarningEvent.unsubscribe();
    }
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Current app activation state:'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.labelText}>
            {this._activationStateToString(this.state.activationState)}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Move app into background and foreground to change the state. The history is recorded here.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.historyText}>
            {this.state.activationHistory}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Launch other apps to create memory pressure.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.historyText}>
            {'Memory warning events received: ' + this.state.memoryWarningCount}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  private _activationStateToString(state: Ult.Types.AppActivationState): string {
    switch (state) {
      case Ult.Types.AppActivationState.Active:
        return 'Active';
      case Ult.Types.AppActivationState.Background:
        return 'Background';
      case Ult.Types.AppActivationState.Inactive:
        return 'Inactive';
      case Ult.Types.AppActivationState.Extension:
        return 'Extension';
      default:
        return 'Unknown';
    }
  }
}

class AppTest implements Test {
  getPath(): string {
    return 'APIs/App';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <AppView ref={onMount} />;
  }
}

export default new AppTest();
