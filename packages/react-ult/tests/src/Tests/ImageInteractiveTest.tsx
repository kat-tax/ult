/*
* Tests the functionality of the Image component
* that requires manual user validation.
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
  image: Ult.Styles.Image({
    height: 100,
    width: 250,
    marginHorizontal: 32,
    borderWidth: 1,
    borderColor: '#ccc'
  })
};

class ImageView extends Ult.Component<Ult.CommonProps, Ult.Stateless> {
  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'JPEG image using "stretch" resize option. Hovering should display a tooltip.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Image
          style={_styles.image}
          source={'https://microsoft.github.io/reactxp/img/tests/bulb.jpg'}
          resizeMode={'stretch'}
          title={'This is a tooltip'}
        />
        <Ult.View style={_styles.explainTextContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'PNG image using "contain" resize option. Uses rasterize option on iOS.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Image
          style={_styles.image}
          source={'https://microsoft.github.io/reactxp/img/tests/globe.png'}
          resizeMode={'contain'}
        />
        <Ult.View style={_styles.explainTextContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Animated GIF image using "cover" resize option.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Image
          style={_styles.image}
          source={'https://microsoft.github.io/reactxp/img/tests/heart.gif'}
          resizeMode={'cover'}
        />
        <Ult.View style={_styles.explainTextContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'JPEG image using "repeat" resize option.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Image
          style={_styles.image}
          source={'https://microsoft.github.io/reactxp/img/tests/bulb.jpg'}
          resizeMode={'repeat'}
        />
        <Ult.View style={_styles.explainTextContainer} key={'explanation5'}>
          <Ult.Text style={_styles.explainText}>
            {'JPEG image using "auto" resize option.'}
          </Ult.Text>
        </Ult.View>
        <Ult.Image
          style={_styles.image}
          source={'https://microsoft.github.io/reactxp/img/tests/bulb.jpg'}
          resizeMode={'auto'}
        />
      </Ult.View>
    );
  }
}

class ImageInteractiveTest implements Test {
  getPath(): string {
    return 'Components/Image/Interactive';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <ImageView ref={onMount}/>;
  }
}

export default new ImageInteractiveTest();
