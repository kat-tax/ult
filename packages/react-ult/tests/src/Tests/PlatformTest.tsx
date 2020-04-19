/*
* Tests the Ult.Platform APIs.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {AutoExecutableTest, TestResult, TestType} from '../Test';

const _styles = {
  container: Ult.Styles.View({
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  }),
  textContainer: Ult.Styles.View({
    margin: 12
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  platformText: Ult.Styles.Text({
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black'
  })
};

interface PlatformState {
  platformType?: Ult.Types.PlatformType;
}

class PlatformView extends Ult.Component<Ult.CommonProps, PlatformState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      platformType: undefined
    };
  }

  render() {
    const platformTypeText = Ult.Platform.select({
      'web': 'Browser (web)',
      'ios': 'iOS',
      'android': 'Android',
      'windows': 'Windows (UWP)',
      'default': `Unknown (${JSON.stringify(this.state.platformType)})`
    });

    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation'}>
          <Ult.Text style={_styles.explainText}>
            {'When the test is run, the platform type will be displayed below.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'platform'}>
          <Ult.Text style={_styles.platformText}>
            {platformTypeText}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  execute() {
    this.setState({
      platformType: Ult.Platform.getType()
    });
  }
}

class PlatformTest implements AutoExecutableTest {
  getPath(): string {
    return 'APIs/Platform';
  }

  getTestType(): TestType {
    return TestType.AutoExecutable;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <PlatformView ref={onMount}/>;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    // Nothing to do but report success
    let results = new TestResult();
    let platformView = component as PlatformView;
    platformView.execute();
    complete(results);
  }
}

export default new PlatformTest();
