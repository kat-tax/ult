/*
* Tests the Ult.Linking APIs in an interactive manner.
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
  resultText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  }),
  buttonContainer: Ult.Styles.View({
    flexDirection: 'row',
    alignItems: 'center'
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

interface LinkingState {
  initialUrl?: string;
  openValidUrlResult?: string;
  openInvalidUrlResult?: string;
  openSmsResult?: string;
  openEmailResult?: string;
}

class LinkingView extends Ult.Component<Ult.CommonProps, LinkingState> {
  private _isMounted = false;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      initialUrl: undefined,
      openValidUrlResult: '',
      openInvalidUrlResult: '',
      openSmsResult: '',
      openEmailResult: ''
    };
  }

  componentDidMount() {
    this._isMounted = true;

    Ult.Linking.getInitialUrl().then(url => {
      if (this._isMounted) {
        if (!url) {
          this.setState({initialUrl: '(blank URL)'});
        } else {
          this.setState({initialUrl: url});
        }
      }
    }).catch(err => {
      if (this._isMounted) {
        this.setState({initialUrl: '(Received error: ' + err + ')'});
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Initial URL used to launch the app:'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.labelText}>
            {this.state.initialUrl}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Open "https://ult.dev/" into the default browser'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.buttonContainer}>
          <Ult.Button
            style={_styles.button}
            onPress={this._openValidUrl}>
            <Ult.Text style={_styles.buttonText}>
              {'Open valid URL'}
            </Ult.Text>
          </Ult.Button>
          <Ult.Text style={_styles.resultText}>
            {this.state.openValidUrlResult}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Open "foo://ult" into the default browser'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.buttonContainer}>
          <Ult.Button
            style={_styles.button}
            onPress={this._openInvalidUrl}>
            <Ult.Text style={_styles.buttonText}>
              {'Open invalid URL'}
            </Ult.Text>
          </Ult.Button>
          <Ult.Text style={_styles.resultText}>
            {this.state.openInvalidUrlResult}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation4'}>
          <Ult.Text style={_styles.explainText}>
            {'Open in default SMS app'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.buttonContainer}>
          <Ult.Button
            style={_styles.button}
            onPress={this._openSms}>
            <Ult.Text style={_styles.buttonText}>
              {'Launch SMS'}
            </Ult.Text>
          </Ult.Button>
          <Ult.Text style={_styles.resultText}>
            {this.state.openSmsResult}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation5'}>
          <Ult.Text style={_styles.explainText}>
            {'Open in default email app'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.buttonContainer}>
          <Ult.Button
            style={_styles.button}
            onPress={this._openEmail}>
            <Ult.Text style={_styles.buttonText}>
              {'Launch Email'}
            </Ult.Text>
          </Ult.Button>
          <Ult.Text style={_styles.resultText}>
            {this.state.openEmailResult}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  private _openValidUrl = () => {
    Ult.Linking.openUrl('https://ult.dev/').then(() => {
      if (this._isMounted) {
        this.setState({openValidUrlResult: 'Succeeded'});
      }
    }).catch(err => {
      let linkErr = err as Ult.Types.LinkingErrorInfo;
      if (this._isMounted) {
        this.setState({openValidUrlResult: this._formatLinkingError(linkErr)});
      }
    });
  }

  private _openInvalidUrl = () => {
    Ult.Linking.openUrl('foo://ult').then(() => {
      if (this._isMounted) {
        this.setState({openInvalidUrlResult: 'Succeeded'});
      }
    }).catch(err => {
      let linkErr = err as Ult.Types.LinkingErrorInfo;
      if (this._isMounted) {
        this.setState({openInvalidUrlResult: this._formatLinkingError(linkErr)});
      }
    });
  }

  private _openSms = () => {
    let smsData: Ult.Types.SmsInfo = {
      phoneNumber: '1-555-555-5555',
      body: 'You up?'
    };
    Ult.Linking.launchSms(smsData).then(() => {
      if (this._isMounted) {
        this.setState({openSmsResult: 'Succeeded'});
      }
    }).catch(err => {
      let linkErr = err as Ult.Types.LinkingErrorInfo;
      if (this._isMounted) {
        this.setState({openSmsResult: this._formatLinkingError(linkErr)});
      }
    });
  }

  private _openEmail = () => {
    let emailInfo: Ult.Types.EmailInfo = {
      to: ['ult@microsoft.com', 'a@foo.com', 'b@foo.com'],
      cc: ['d@foo.com', 'e@foo.com'],
      bcc: ['ult@microsoft.com'],
      subject: 'Test - please ignore',
      body: 'Nothing to see here'
    };
    Ult.Linking.launchEmail(emailInfo).then(() => {
      if (this._isMounted) {
        this.setState({openEmailResult: 'Succeeded'});
      }
    }).catch(err => {
      let linkErr = err as Ult.Types.LinkingErrorInfo;
      if (this._isMounted) {
        this.setState({openEmailResult: this._formatLinkingError(linkErr)});
      }
    });
  }

  private _formatLinkingError(err: Ult.Types.LinkingErrorInfo): string {
    let errString = 'Unknown';
    switch (err.code) {
      case Ult.Types.LinkingErrorCode.NoAppFound:
        errString = 'No App Found';
        break;
      case Ult.Types.LinkingErrorCode.UnexpectedFailure:
        errString = 'Unexpected Error';
        break;
      case Ult.Types.LinkingErrorCode.Blocked:
        errString = 'Blocked';
        break;
      case Ult.Types.LinkingErrorCode.InitialUrlNotFound:
        errString = 'Initial URL Not Found';
        break;
    }

    return 'Error: ' + errString;
  }
}

class LinkingTest implements Test {
  getPath(): string {
    return 'APIs/Linking';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <LinkingView ref={onMount}/>;
  }
}

export default new LinkingTest();
