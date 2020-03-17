/*
* Tests the basic functionality of an ActivityIndicator component.
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
  aiContainer: Ult.Styles.View({
    margin: 20
  }),
  explainTextContainer: Ult.Styles.View({
    margin: 12
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  })
};

interface ActivityIndicatorViewState {
  renderIndicators?: boolean;
}

class ActivityIndicatorView extends Ult.Component<Ult.CommonProps, ActivityIndicatorViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      renderIndicators: false
    };
  }

  render() {
    let optionalIndicators: JSX.Element[] = [];

    if (this.state.renderIndicators) {
      // Render large indicator with no delay.
      optionalIndicators.push(
        <Ult.View style={_styles.aiContainer} key={'large'}>
          <Ult.ActivityIndicator
            size={'large'}
            color={'#333'}
            testId={'activityIndicator1'}
          />
        </Ult.View>
      );

      // Render medium indicator with 250ms delay.
      optionalIndicators.push(
        <Ult.View style={_styles.aiContainer} key={'medium'}>
          <Ult.ActivityIndicator
            size={'medium'}
            color={'red'}
            deferTime={250}
          />
        </Ult.View>
      );

      // Render small indicator with 500ms delay.
      optionalIndicators.push(
        <Ult.View style={_styles.aiContainer} key={'small'}>
          <Ult.ActivityIndicator
            size={'small'}
            color={'green'}
            deferTime={500}
          />
        </Ult.View>
      );

      // Render tiny indicator with 1000ms delay.
      optionalIndicators.push(
        <Ult.View style={_styles.aiContainer} key={'tiny'}>
          <Ult.ActivityIndicator
            size={'tiny'}
            color={'black'}
            deferTime={1000}
          />
        </Ult.View>
      );
    }

    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation'}>
          <Ult.Text style={_styles.explainText}>
            {'When the test is run, four activity indicators should appear with varying sizes and delays'}
          </Ult.Text>
        </Ult.View>
        {optionalIndicators}
      </Ult.View>
    );
  }

  execute(finished: () => void) {
    this.setState({renderIndicators: true});
    _.delay(() => {
      this.setState({renderIndicators: false});
      finished();
    }, 1500);
  }
}

class ActivityIndicatorTest implements AutoExecutableTest {
  getPath(): string {
    return 'Components/ActivityIndicator';
  }

  getTestType(): TestType {
    return TestType.AutoExecutable;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <ActivityIndicatorView ref={onMount} />;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    // Nothing to do but report success
    let results = new TestResult();
    let aiView = component as ActivityIndicatorView;
    aiView.execute(() => complete(results));
  }
}

export default new ActivityIndicatorTest();
