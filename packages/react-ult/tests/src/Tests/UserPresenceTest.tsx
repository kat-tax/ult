/*
* Tests the Ult.UserPresence APIs in an interactive manner.
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
  })
};

interface UserPresenceViewState {
  isUserPresent?: boolean;
}

class UserPresenceView extends Ult.Component<Ult.CommonProps, UserPresenceViewState> {
  private _presencesChangedEvent: Ult.Types.SubscriptionToken | undefined;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      isUserPresent: Ult.UserPresence.isUserPresent()
    };
  }

  componentDidMount() {
    this._presencesChangedEvent = Ult.UserPresence.userPresenceChangedEvent.subscribe(isPresent => {
      this.setState({isUserPresent: isPresent});
    });
  }

  componentWillUnmount() {
    if (this._presencesChangedEvent) {
      this._presencesChangedEvent.unsubscribe();
    }
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Is the user currently present? Depending on the platform, placing the app in ' +
              'the background or leaving it idle may change this state.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer} key={'platform'}>
          <Ult.Text style={_styles.labelText}>
            {this.state.isUserPresent ? 'Present' : 'Away'}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }
}

class UserPresenceTest implements Test {
  getPath(): string {
    return 'APIs/UserPresence';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <UserPresenceView ref={onMount}/>;
  }
}

export default new UserPresenceTest();
