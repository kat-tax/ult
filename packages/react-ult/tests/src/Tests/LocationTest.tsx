/*
* Tests the Ult.Location APIs in an automated manner.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {AutoExecutableTest, TestResult, TestType} from '../Test';

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
    marginHorizontal: 32,
    marginBottom: 12,
    fontSize: CommonStyles.generalFontSize,
    color: 'black'
  })
};

const msPerSample = 2000;
const totalSamplesInTest = 3;

interface LocationState {
  isLocationAvailable?: boolean;
  // Used for polling the location
  polledPositionHistory?: string;
  // Used for "watching" the location (geofencing)
  watchPositionHistory?: string;
}

class LocationView extends Ult.Component<Ult.CommonProps, LocationState> {
  private _isMounted = false;
  private _locationWatchId: Ult.Types.LocationWatchId | undefined;
  private _timerId = 0;

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      isLocationAvailable: Ult.Location.isAvailable(),
      polledPositionHistory: '',
      watchPositionHistory: ''
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    if (this._locationWatchId !== undefined) {
      Ult.Location.clearWatch(this._locationWatchId);
    }
    this._isMounted = false;
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Are geolocation services available on this platform?'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.labelContainer}>
          <Ult.Text style={_styles.labelText}>
            {this.state.isLocationAvailable ? 'Geolocation Available' : 'Geolocation Not Available'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Polled location (low accuracy):'}
          </Ult.Text>
        </Ult.View>
        <Ult.Text style={_styles.historyText}>
          {this.state.polledPositionHistory || '(no history available)'}
        </Ult.Text>
        <Ult.View style={_styles.textContainer} key={'explanation3'}>
          <Ult.Text style={_styles.explainText}>
            {'Watched location (high accuracy):'}
          </Ult.Text>
        </Ult.View>
        <Ult.Text style={_styles.historyText}>
          {this.state.watchPositionHistory || '(no history available)'}
        </Ult.Text>
      </Ult.View>
    );
  }

  execute(complete: (result: TestResult) => void) {
    let result = new TestResult();

    // If services are not available, return success immediately.
    if (!this.state.isLocationAvailable) {
      return complete(result);
    }

    this.setState({
      polledPositionHistory: '',
      watchPositionHistory: ''
    });

    let loggedPolledLocationError = false;
    let sampleCount = 0;
    let loggedWatchedLocationError = false;
    let watchId: Ult.Types.LocationWatchId;

    let pollLocation = () => {
      Ult.Location.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: msPerSample * 0.9
      }).then(position => {
        this.setState({
          polledPositionHistory: this.state.polledPositionHistory
            + this._formatPosition(position) + '\n'
        });
      }).catch(err => {
        // Log the error, but make sure we don't log it more than once.
        const errCode = err.code as Ult.Types.LocationErrorType;

        // Don't log a timeout as an error.
        if (errCode !== Ult.Types.LocationErrorType.Timeout) {
          if (!loggedPolledLocationError) {
            result.errors.push('Ult.Location.getCurrentPosition returned error: ' +
              this._formatError(errCode));
            loggedPolledLocationError = true;
          }
        }

        this.setState({
          polledPositionHistory: this.state.polledPositionHistory
            + '(' + this._formatError(err.code as Ult.Types.LocationErrorType) + ')\n'
        });
      }).finally(() => {
        sampleCount++;
        if (sampleCount < totalSamplesInTest) {
          _.delay(() => {pollLocation()}, msPerSample);
        } else {
          // Stop watching the position.
          if (watchId !== undefined) {
            Ult.Location.clearWatch(watchId);
          }
          // Mark the test as complete.
          complete(result);
        }
      });
    };
    _.defer(() => {
      // Start polling, but do it in a deferred manner to allow
      // for setState to take effect first.
      pollLocation();
    });

    let logWatchedLocationError = (err: Ult.Types.LocationErrorType) => {
      // Log the error, but make sure we don't log it more than once.
      const errCode = err as Ult.Types.LocationErrorType;
      
      // Don't log a timeout as an error.
      if (errCode !== Ult.Types.LocationErrorType.Timeout) {
        if (!loggedWatchedLocationError) {
          result.errors.push('Ult.Location.watchPosition returned error: ' +
            this._formatError(errCode));
          loggedWatchedLocationError = true;
        }
      }

      this.setState({
        watchPositionHistory: this.state.watchPositionHistory
          + '(' + this._formatError(err as Ult.Types.LocationErrorType) + ')\n'
      });
    };

    // Start the watched position in parallel.
    Ult.Location.watchPosition(position => {
      this.setState({
        watchPositionHistory: this.state.watchPositionHistory
          + this._formatPosition(position) + '\n'
      });
    }, err => {
      logWatchedLocationError(err);
    }, {
      enableHighAccuracy: true,
      timeout: msPerSample * (totalSamplesInTest - 1),
      maximumAge: msPerSample
    }).then(id => {
      watchId = id;
    }).catch(err => {
      logWatchedLocationError(err.code);
    });
  }

  private _formatPosition(pos: Position) {
    return 'Lat: ' + pos.coords.latitude +
      ', Long: ' + pos.coords.longitude +
      ', Alt: ' + pos.coords.altitude +
      ', Speed: ' + pos.coords.speed +
      ', Heading: ' + pos.coords.heading +
      ', Accur: ' + pos.coords.accuracy +
      ', AltAccur: ' + pos.coords.altitudeAccuracy;
  }

  private _formatError(error: Ult.Types.LocationErrorType): string {
    switch (error) {
      case Ult.Types.LocationErrorType.PermissionDenied:
        return 'Permission Denied';
      case Ult.Types.LocationErrorType.Timeout:
        return 'Timeout';
      case Ult.Types.LocationErrorType.PositionUnavailable:
        return 'Position Unavailable';
      default:
        return 'Unknown Error (' + error + ')';
    }
  }
}

class LocationTest implements AutoExecutableTest {
  getPath(): string {
    return 'APIs/Location';
  }

  getTestType(): TestType {
    return TestType.AutoExecutable;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <LocationView ref={onMount}/>;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let locationView = component as LocationView;
    locationView.execute(complete);
  }
}

export default new LocationTest();
