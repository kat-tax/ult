/*
* Tests the Ult.Modal APIs in an automated manner.
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
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  modalText: Ult.Styles.View({
    margin: 8
  }),
  modalBox1: Ult.Styles.Text({
    flex: 1,
    alignSelf: 'stretch',
    margin: 50,
    backgroundColor: '#eee',
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  modalBox2: Ult.Styles.Text({
    alignSelf: 'stretch',
    marginHorizontal: 25,
    backgroundColor: '#ccf',
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  })
};

const modal1Id = 'modal1';
const modal2Id = 'modal2';

class ModalView extends Ult.Component<Ult.CommonProps, Ult.Stateless> {
  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'This test displays and then dismisses several modals in succession. ' +
              'You should see a large gray modal cover nearly the entire screen followed ' +
              'by a wide, short purple modal.'}
          </Ult.Text>
        </Ult.View>
      </Ult.View>
    );
  }

  execute(complete: (result: TestResult) => void) {
    let result = new TestResult();

    // Show modal 1.
    Ult.Modal.show(
      <Ult.View style={_styles.modalBox1}>
        <Ult.Text style={_styles.modalText}>
          {'This is modal 1'}
        </Ult.Text>
      </Ult.View>,
    modal1Id);

    // Wait for a brief time, then show modal 2.
    _.delay(() => {
      Ult.Modal.show(
        <Ult.View style={_styles.modalBox2}>
          <Ult.Text style={_styles.modalText}>
            {'This is modal 2'}
          </Ult.Text>
        </Ult.View>,
      modal2Id);

      // Wait for a brief time, then dismiss modal 1.
      _.delay(() => {
        // Validate that both modals are "displayed" (even though only one is visible).
        if (!Ult.Modal.isDisplayed(modal1Id))
          result.errors.push('Expected Ult.Modal.isDisplayed to return true for modal 1');
        if (!Ult.Modal.isDisplayed(modal2Id))
          result.errors.push('Expected Ult.Modal.isDisplayed to return true for modal 2');

        // Dismiss the first modal.
        Ult.Modal.dismiss(modal1Id);

        // Validate that only modal 2 is now displayed.
        if (Ult.Modal.isDisplayed(modal1Id))
          result.errors.push('Expected Ult.Modal.isDisplayed to return false for modal 1');
        if (!Ult.Modal.isDisplayed(modal2Id))
          result.errors.push('Expected Ult.Modal.isDisplayed to return true for modal 2');
        if (!Ult.Modal.isDisplayed())
          result.errors.push('Expected Ult.Modal.isDisplayed to return true for undefined');

        // Dismiss all modals.
        Ult.Modal.dismissAll();

        if (Ult.Modal.isDisplayed(modal2Id))
          result.errors.push('Expected Ult.Modal.isDisplayed to return false for modal 2');
        if (Ult.Modal.isDisplayed())
          result.errors.push('Expected Ult.Modal.isDisplayed to return false for undefined');

        _.delay(() => {complete(result)}, 250);
      }, 500);
    }, 500);
  }
}

class ModalTest implements AutoExecutableTest {
  getPath(): string {
    return 'APIs/Modal';
  }

  getTestType(): TestType {
    return TestType.AutoExecutable;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <ModalView ref={onMount}/>;
  }

  execute(component: any, complete: (result: TestResult) => void): void {
    let ModalView = component as ModalView;
    ModalView.execute(complete);
  }
}

export default new ModalTest();
