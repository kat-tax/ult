/*
* Tests the functionality of a ScrollView component
* through user interaction.
*
* We need to split the ScrollView tests into multiple pages because
* we can't embed ScrollViews within a parent ScrollView.
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
  scrollViewContainer: Ult.Styles.View({
    margin: 12,
    alignSelf: 'stretch',
    height: 150,
    width: 320
  }),
  scrollView1: Ult.Styles.ScrollView({
  }),
  numberGrid: Ult.Styles.View({
    width: 400,
    backgroundColor: '#eef',
    flexDirection: 'row',
    flexWrap: 'wrap'
  }),
  numberContainer: Ult.Styles.View({
    height: 50,
    width: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center'
  }),
  numberText: Ult.Styles.Text({
    fontSize: 24
  }),
  listContainer: Ult.Styles.View({
  }),
  numberItem: Ult.Styles.View({
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: '#eee',
    justifyContent: 'center'
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
    fontSize: CommonStyles.buttonFontSize,
    marginHorizontal: 12,
    color: CommonStyles.buttonTextColor
  })
};

const _colors = ['red', 'green', 'blue'];

interface ScrollViewState {
  horizontalIndicator: boolean;
  verticalIndicator: boolean;
}

class ScrollViewView extends Ult.Component<Ult.CommonProps, ScrollViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      horizontalIndicator: true,
      verticalIndicator: true
    };
  }

  render() {
    let numberBoxes: JSX.Element[] = [];
    for (let i = 0; i < 40; i++) {
      numberBoxes.push(
        <Ult.View style={_styles.numberContainer} key={'Box' + i}>
          <Ult.Text style={_styles.numberText}>
            {i}
          </Ult.Text>
        </Ult.View>
      );
    }

    let numberItems: JSX.Element[] = [];
    for (let i = 0; i < 20; i++) {
      numberItems.push(
        <Ult.View style={_styles.numberItem} key={'Item' + i}>
          <Ult.Text style={_styles.numberText}>
            {'List item ' + i}
          </Ult.Text>
        </Ult.View>
      );
    }

    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Scroll view with both vertical and horizontal scrolling. ' +
              'Bouncing (iOS) and over-scroll (Android) are disabled. ' +
              'Press buttons to toggle scroll indicators.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Button
          style={_styles.button}
          onPress={() => {
            this.setState({
              horizontalIndicator: !this.state.horizontalIndicator
            });
          }}>
          <Ult.Text style={_styles.buttonText}>
            {'Horizontal indicator: ' + (this.state.horizontalIndicator ? 'On' : 'Off')}
          </Ult.Text>
        </Ult.Button>
        <Ult.Button
          style={_styles.button}
          onPress={() => {
            this.setState({
              verticalIndicator: !this.state.verticalIndicator
            });
          }}>
          <Ult.Text style={_styles.buttonText}>
            {'Vertical indicator: ' + (this.state.verticalIndicator ? 'On' : 'Off')}
          </Ult.Text>
        </Ult.Button>
        <Ult.View style={_styles.scrollViewContainer}>
          <Ult.ScrollView
            style={_styles.scrollView1}
            horizontal={true}
            bounces={false}
            overScrollMode={'never'}
            showsHorizontalScrollIndicator={this.state.horizontalIndicator}
            showsVerticalScrollIndicator={this.state.verticalIndicator}
            testId={'scrollView1'}>
            <Ult.View style={_styles.numberGrid}>
              {numberBoxes}
            </Ult.View>
          </Ult.ScrollView>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Scroll view with vertical paging with 50px pages.' +
              'Scrolls to top (iOS) when tapping on the status bar.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.scrollViewContainer}>
          <Ult.ScrollView
            style={_styles.scrollView1}
            snapToInterval={50}
            scrollsToTop={true}>
            <Ult.View style={_styles.listContainer}>
              {numberItems}
            </Ult.View>
          </Ult.ScrollView>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Scroll is disabled'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.scrollViewContainer}>
          <Ult.ScrollView
            style={_styles.scrollView1}
            scrollEnabled={false}>
            <Ult.View style={_styles.listContainer}>
              {numberItems}
            </Ult.View>
          </Ult.ScrollView>
        </Ult.View>
      </Ult.View>
    );
  }
}

class ScrollViewTest implements Test {
  useFullScreenContainer = true;

  getPath(): string {
    return 'Components/ScrollView/Basic';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <ScrollViewView ref={onMount}/>;
  }
}

export default new ScrollViewTest();
