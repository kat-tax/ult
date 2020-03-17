/*
* Tests the basic functionality of a View component.
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
  view1: Ult.Styles.View({
    margin: 20,
    backgroundColor: '#ccf',
    transform: [{
      rotate: '5deg'
    }]
  }),
  view2: Ult.Styles.View({
    margin: 20,
    backgroundColor: 'orange',
    borderWidth: 2,
    borderColor: 'black'
  }),
  view2MarginOverride: Ult.Styles.View({
    marginLeft: 30,
    marginRight: 10
  }),
  view3: Ult.Styles.View({
    margin: 20,
    backgroundColor: 'yellow',
    borderWidth: 1,
    borderColor: 'green',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  view4: Ult.Styles.View({
    backgroundColor: 'green',
    width: 50,
    height: 50,
    margin: 20,
    shadowColor: 'red',
    shadowOffset: {width: 1, height: 4},
    shadowRadius: 5
  }),
  explainTextContainer: Ult.Styles.View({
    margin: 12
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  labelContainer: Ult.Styles.View({
    alignSelf: 'center',
    margin: 8
  }),
  labelText: Ult.Styles.Text({
    margin: 8,
    fontSize: CommonStyles.generalFontSize,
  })
};

function accessibilityLabelAndImportantForAccessibilityTestUI(important: Ult.Types.ImportantForAccessibility) {
  return (
    <Ult.View
      style={_styles.labelContainer}
      importantForAccessibility={important}>
      <Ult.View
        style={_styles.labelContainer}
        importantForAccessibility={Ult.Types.ImportantForAccessibility.Auto}>
        <Ult.Text style={_styles.labelText}>
          {'Alpha'}
        </Ult.Text>
      </Ult.View>
      <Ult.View style={_styles.labelContainer}>
        <Ult.View
          style={_styles.labelContainer}
          importantForAccessibility={Ult.Types.ImportantForAccessibility.No}>
          <Ult.Text style={_styles.labelText}>
            {'Beta'}
          </Ult.Text>
        </Ult.View>
        <Ult.View
          style={_styles.labelContainer}
          accessibilityLabel={'Gamma'}>
          <Ult.Text style={_styles.labelText}>
            {'Orange'}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
      <Ult.Text style={_styles.labelText}>
        {'Delta'}
      </Ult.Text>
      <Ult.View
        style={_styles.labelContainer}
        importantForAccessibility={Ult.Types.ImportantForAccessibility.NoHideDescendants}>
        <Ult.View
          style={_styles.labelContainer}
          importantForAccessibility={Ult.Types.ImportantForAccessibility.Yes}>
          <Ult.Text style={_styles.labelText}>
            {'Epsilon'}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    </Ult.View>
  );
}

class BasicView extends Ult.Component<Ult.CommonProps, Ult.Stateless> {
  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'A variety of views with different styles should appear below. ' +
              'Interact with them to test.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View
          style={_styles.view1}
          shouldRasterizeIOS={true}
          viewLayerTypeAndroid={'hardware'}
          tabIndex={1}
          title={'shouldRasterizeIOS = true\nviewLayerTypeAndroid = true'}
          onLongPress={() => {/* no-op */}}
          id={'testId'}
          ariaLabelledBy={'aria label'}
          ariaRoleDescription={'custom role'}
          accessibilityLabel={'accessibility label'}
          accessibilityLiveRegion={Ult.Types.AccessibilityLiveRegion.Polite}
          importantForAccessibility={Ult.Types.ImportantForAccessibility.Yes}
          testId={'view1'}>
          <Ult.Text style={_styles.labelText}>
            {'Long press me'}
          </Ult.Text>
        </Ult.View>
        <Ult.View
          style={_styles.view2}
          onPress={() => {/* no-op */}}
          activeOpacity={0.5}
          underlayColor={'#fee'}
          tabIndex={3}>
          <Ult.Text style={[_styles.view2MarginOverride, _styles.labelText]}>
            {'Press me'}
          </Ult.Text>
        </Ult.View>

        <Ult.View
          style={_styles.view3}
          onPress={() => {/* no-op */}}
          disableTouchOpacityAnimation={true}
          tabIndex={2}>
          <Ult.Text style={_styles.labelText}>
            {'Press me (no opacity change)\n' +
              'I have differing border radii'}
          </Ult.Text>
        </Ult.View>

        {/* View's accessibilityLabel (both explicit and automatic recursive generation)
          * and importantForAccessibility all possible values and hierarchical combinations. */}

        <Ult.View
          style={_styles.explainTextContainer}
          key={'explanation2' }>
          <Ult.Text style={_styles.explainText}>
            {'Should be read by screen reader as a single text element \"Alpha Beta Gamma Delta\" ' +
              'and screen reader should not be able to get to individual texts.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          {accessibilityLabelAndImportantForAccessibilityTestUI(Ult.Types.ImportantForAccessibility.Yes)}
        </Ult.View>

        <Ult.View
          style={_styles.explainTextContainer}
          key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Should be read by screen reader as four separate text elements: ' +
              '\"Alpha\", \"Beta\", \"Gamma\", \"Delta\".'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          {accessibilityLabelAndImportantForAccessibilityTestUI(Ult.Types.ImportantForAccessibility.No)}
        </Ult.View>

        <Ult.View
          style={_styles.explainTextContainer}
          key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'Box shadow can be applied with the shadow props.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.view4} />
      </Ult.View>
    );
  }
}

// TODO - need to add tests for the following props:
// blockPointerEvents: boolean = false; // iOS and Android only
// ignorePointerEvents: boolean = false; // web only
// restrictFocusWithin: boolean = false; // web only
// limitFocusWithin: LimitFocusType = LimitFocusType.Unlimited;
// importantForLayout: boolean = false; // web only
// onContextMenu: (e: React.SyntheticEvent) => void;
// onMoveShouldSetResponder: (e: React.SyntheticEvent) => boolean =
// onMoveShouldSetResponderCapture: (e: React.SyntheticEvent) => boolean =
// onResponderGrant: (e: React.SyntheticEvent) => void = undefined;
// onResponderReject: (e: React.SyntheticEvent) => void = undefined;
// onResponderRelease: (e: React.SyntheticEvent) => void = undefined;
// onResponderStart: (e: React.TouchEvent) => void = undefined;
// onResponderMove: (e: React.TouchEvent) => void = undefined;
// onResponderEnd: (e: React.TouchEvent) => void = undefined;
// onResponderTerminate: (e: React.SyntheticEvent) => void = undefined;
// onResponderTerminationRequest: (e: React.SyntheticEvent) => boolean =
// onStartShouldSetResponder: (e: React.SyntheticEvent) => boolean =
// onStartShouldSetResponderCapture: (e: React.SyntheticEvent) => boolean =
// onLayout: (e: ViewOnLayoutEvent) => void = undefined;

// TODO - need to add tests for the following methods:
// focus
// setFocusRestricted
// setFocusLimited

class ViewBasicTest implements Test {
  getPath(): string {
    return 'Components/View/Basic';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return (
      <BasicView ref={onMount}/>
    );
  }
}

export default new ViewBasicTest();
