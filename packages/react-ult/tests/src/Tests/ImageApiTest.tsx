/*
* Tests the functionality of a Image component that can be
* auto-validated.
*/

import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {AutoExecutableTest, TestResult, TestType} from '../Test';
import {approxEquals} from '../Utilities';

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
    width: 100
  })
};

const image1ExpectedWidth = 118;
const image1ExpectedHeight = 200;

interface ImageViewState {
  isTestRunning?: boolean;
}

class ImageView extends Ult.Component<Ult.CommonProps, ImageViewState> {
  private _isMounted = false;
  private _image1Ref: Ult.Image | undefined;
  private _textRef: Ult.Text | undefined;
  private _test1Complete = false;
  private _test2Complete = false;
  private _test3Complete = false;
  private _test4Complete = false;
  private _test5Complete = false;
  private _testResult: TestResult | undefined;
  private _testCompletion: ((result: TestResult) => void) | undefined;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      isTestRunning: false
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    let optionalImages: JSX.Element | undefined;
    if (this.state.isTestRunning) {
      optionalImages = (
        <Ult.View>
          <Ult.Image
            style={_styles.image}
            source={'https://microsoft.github.io/reactxp/img/tests/bulb.jpg'}
            onLoad={this._onLoadTest1}
            onError={this._onErrorTest1}
            ref={(comp: any) => {this._image1Ref = comp}}
            testId={'image1'}
          />
          <Ult.Image
            style={_styles.image}
            source={'https://microsoft.github.io/reactxp/img/tests/bogus.jpg'}
            onLoad={this._onLoadTest2}
            onError={this._onErrorTest2}
          />
          <Ult.Image
            style={_styles.image}
            source={'https://microsoft.github.io/reactxp/img/tests/bulb.jpg'}
            ref={this._onMountImageChildTest}>
            <Ult.Text ref={(comp: any) => {this._textRef = comp}}>
              Child Text
            </Ult.Text>
          </Ult.Image>
        </Ult.View>
      );

      // Kicking-off Image API calls
      Ult.Image.prefetch('https://microsoft.github.io/reactxp/img/tests/bogus.jpg')
        .then(this._prefetchedTest3)
        .catch(this._prefetchedFailedTest3);

      Ult.Image.getMetadata('https://microsoft.github.io/reactxp/img/tests/bulb.jpg')
        .then(this._getMetadataTest4)
        .catch(this._getMetadataFailedTest4);
    }

    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation'}>
          <Ult.Text style={_styles.explainText}>
            {'Tests various aspects of the Image component that can be automatically validated.'}
          </Ult.Text>
        </Ult.View>
        {optionalImages}
      </Ult.View>
    );
  }

  private _onLoadTest1 = (dimensions: Ult.Types.Dimensions) => {
    this._test1Complete = true;

    if (this._testResult) {
      const pixelRatio = Ult.UserInterface.getPixelRatio();
      if (!dimensions) {
        this._testResult.errors.push('Received undefined dimensions from onLoad');
      } else if (!approxEquals(dimensions.width, image1ExpectedWidth / pixelRatio)
        || !approxEquals(dimensions.height, image1ExpectedHeight / pixelRatio)) {
        this._testResult.errors.push(`Expected dimensions from onLoad to be ${image1ExpectedWidth}x${image1ExpectedHeight}. ` +
          `Got ${dimensions.width}x${dimensions.height}`);
      }

      // Now call the component back to see if we get the same dimensions.
      const width = this._image1Ref!.getNativeWidth();
      const height = this._image1Ref!.getNativeHeight();
      if (width == null || !approxEquals(width, image1ExpectedWidth / pixelRatio)) {
        this._testResult.errors.push(`Expected width from getNativeWidth to be ${image1ExpectedWidth}. Got ${width}`);
      }
      if (height == null || !approxEquals(height, image1ExpectedHeight / pixelRatio)) {
        this._testResult.errors.push(`Expected height from getNativeHeight to be ${image1ExpectedHeight}. Got ${height}`);
      }
    }

    this._checkAllTestsComplete();
  }

  private _onErrorTest1 = () => {
    this._test1Complete = true;
    if (this._testResult) {
      this._testResult.errors.push('Could not load test image');
    }
    this._checkAllTestsComplete();
  }

  private _onLoadTest2 = (dimensions: Ult.Types.Dimensions) => {
    this._test2Complete = true;
    if (this._testResult) {
      this._testResult.errors.push('Was unexpected able to load bogus test image');
    }
    this._checkAllTestsComplete();
  }

  private _onErrorTest2 = () => {
    this._test2Complete = true;
    this._checkAllTestsComplete();
  }

  private _prefetchedTest3 = (success: boolean) => {
    this._test3Complete = true;
    if (success && this._testResult) {
      this._testResult.errors.push('Was unexpected able to prefetch bogus test image');
    }
    this._checkAllTestsComplete();
  }

  private _prefetchedFailedTest3 = (error: any) => {
    this._test3Complete = true;
    if (this._testResult && !error) {
      this._testResult.errors.push('Prefetching bogus test image failed but error is empty.');
    }
    this._checkAllTestsComplete();
  }

  private _getMetadataTest4 = (metaData: Ult.Types.ImageMetadata) => {
    this._test4Complete = true;
    if (this._testResult) {
      if (!metaData) {
        this._testResult.errors.push('Received undefined image data from getMetadata');
      }

      if (metaData.height !== image1ExpectedHeight) {
        this._testResult.errors.push('Received unexpected height from getMetadata');
      }

      if (metaData.width !== image1ExpectedWidth) {
        this._testResult.errors.push('Received unexpected width from getMetadata');
      }
    }
    this._checkAllTestsComplete();
  }

  private _getMetadataFailedTest4 = (error: any) => {
    this._test4Complete = true;
    if (this._testResult) {
      this._testResult.errors.push('getMetadata for bulb test image failed with error: ', error);
    }
    this._checkAllTestsComplete();
  }

  private _checkAllTestsComplete() {
    // If all of the tests are complete, report the result.
    if (this._test1Complete && this._test2Complete && this._test3Complete && this._test4Complete) {
      // Make sure we report the result only once.
      if (this._testResult) {
        this._testCompletion!(this._testResult);
        this._testResult = undefined;
      }
      if (this._isMounted) {
        this.setState({isTestRunning: false});
      }
    }
  }

  private _onMountImageChildTest = (image: any) => {
    this._test5Complete = true;

    if (this._isMounted && image && !this._textRef) {
      if (this._testResult) {
        this._testResult.errors.push('"children" elements were not rendered');
      }
    }

    this._checkAllTestsComplete();
  }

  execute(complete: (result: TestResult) => void): void {
    this._test1Complete = false;
    this._test2Complete = false;
    this._test3Complete = false;
    this._test4Complete = false;
    this._test5Complete = false;
    this._testResult = new TestResult();
    this._testCompletion = complete;
    // Re-render to kick off the test.
    this.setState({isTestRunning: true});
  }
}

class ImageApiTest implements AutoExecutableTest {
  getPath(): string {
    return 'Components/Image/APIs';
  }

  getTestType(): TestType {
    return TestType.AutoExecutable;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <ImageView ref={onMount}/>;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let imageView = component as ImageView;
    imageView.execute(complete);
  }
}

export default new ImageApiTest();
