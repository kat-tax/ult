/*
* Tests the basic functionality of a Storage APIs.
*/

import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {AutoExecutableTest, TestResult, TestType} from '../Test';

const _storageKey = 'storageKey1';
const _styles = {
  container: Ult.Styles.View({
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  }),
  explainTextContainer: Ult.Styles.View({
    margin: 12
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  })
};

class StorageBasicTest implements AutoExecutableTest {
  getPath(): string {
    return 'APIs/Storage';
  }

  getTestType(): TestType {
    return TestType.AutoExecutable;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return (
      <Ult.View style={_styles.container} ref={onMount}>
        <Ult.View style={_styles.explainTextContainer} key={'explanation'}>
          <Ult.Text style={_styles.explainText}>
            {'When the test is run, the storage APIs will be used to store, retrieve, delete and clear key/value pairs'}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let results = new TestResult();
    Ult.Storage.setItem(_storageKey, 'value1').then(() => {
      return Ult.Storage.getItem(_storageKey).then(value => {
        if (value !== 'value1') {
          results.errors.push('Ult.Storage.getItem returned unexpected value: "' +
            value + '"; expected value1');
        }
        return Ult.Storage.setItem(_storageKey, 'value2');
      }).then(() => {
        return Ult.Storage.getItem(_storageKey);
      }).then(value => {
        if (value !== 'value2') {
          results.errors.push('Ult.Storage.getItem returned unexpected value: "' +
            value + '"; expected value2');
        }
        return Ult.Storage.removeItem(_storageKey);
      }).then(() => {
        return Ult.Storage.getItem(_storageKey);
      }).then(value => {
        if (value !== undefined) {
          results.errors.push('Ult.Storage.getItem returned unexpected value: "' +
            value + '" after removing key; expected undefined');
        }
        return Ult.Storage.setItem(_storageKey, 'value3');
      }).then(() => {
        return Ult.Storage.clear();
      }).then(() => {
        return Ult.Storage.getItem(_storageKey);
      }).then(value => {
        if (value !== undefined) {
          results.errors.push('Ult.Storage.getItem returned unexpected value: "' +
            value + '" after clearing all keys; expected undefined');
        }
      });
    }).catch(error => {
      results.errors.push('Received unexpected error from Ult.Storage');
    }).finally(() => {
      complete(results);
    });
  }
}

export default new StorageBasicTest();
