/*
* Tests the functionality of the Link component
* with manual user validation.
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
  resultText: Ult.Styles.Text({
    marginLeft: 20,
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  linkContainer: Ult.Styles.View({
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 12
  }),
  constrainedLinkContainer: Ult.Styles.View({
    maxWidth: 150,
    marginHorizontal: 24,
    marginBottom: 12
  }),
  link: Ult.Styles.Link({
    fontSize: CommonStyles.generalFontSize,
    color: '#00f',
    textDecorationLine: 'underline',
    textDecorationColor: '#00f'
  }),
  linkHover: Ult.Styles.Link({
    color: '#88f',
    textDecorationColor: '#88f'
  })
};

interface LinkViewState {
  test1Hovering?: boolean;
  test1Result?: string;
}

class LinkView extends Ult.Component<Ult.CommonProps, LinkViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      test1Hovering: false,
      test1Result: ''
    };
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Press on this link to test press callback. Hold to test long presses. ' +
              'Right click to test context menu callback. ' +
              ' Move mouse pointer to test hovering.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.linkContainer}>
          <Ult.Link
            style={[_styles.link, this.state.test1Hovering ? _styles.linkHover : undefined]}
            url={''}
            onPress={() => {this.setState({test1Result: 'Press detected'});}}
            onLongPress={() => {this.setState({test1Result: 'Long press detected'});}}
            onHoverStart={() => {this.setState({test1Hovering: true});}}
            onHoverEnd={() => {this.setState({test1Hovering: false});}}
            onContextMenu={() => {this.setState({test1Result: 'Context menu detected'});}}
            allowFontScaling={false}
            testId={'link1'}>
            {'Press or hold'}
          </Ult.Link>
          <Ult.Text style={_styles.resultText}>
            {this.state.test1Result}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'This link is artificially constrained to one line and should appear ' +
              'truncated. Press to open a browser target. Hover to display tooltip.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.constrainedLinkContainer}>
          <Ult.Link
            style={_styles.link}
            url={'https://microsoft.github.io/reactxp/docs/components/link.html'}
            title={'Open Ult.Link documentation in browser'}
            numberOfLines={1}>
            {'Documentation for Ult.Link'}
          </Ult.Link>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            <Ult.Text selectable={true}>
              {'Links can also be used with other '}
            </Ult.Text>
            <Ult.Link
              style={_styles.link}
              title={'Open Ult.Text documentation in browser'}
              url={'https://microsoft.github.io/reactxp/docs/components/text.html'}
              selectable={true}>
              {'Ult.Text'}
            </Ult.Link>
            <Ult.Text selectable={true}>
              {' components. The link and text should be selectable. '}
            </Ult.Text>
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }
}

class LinkTest implements Test {
  getPath(): string {
    return 'Components/Link';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <LinkView ref={onMount}/>;
  }
}

export default new LinkTest();
