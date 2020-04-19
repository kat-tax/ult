/*
* Tests mouse/touch/pointer functionality of a View component.
*/

import * as _ from 'lodash';
import * as Ult from 'react-ult';
import * as CommonStyles from '../CommonStyles';
import {Test, TestResult, TestType} from '../Test';

const _styles = {
  explainTextContainer: Ult.Styles.View({
    margin: 12,
    maxWidth: 800
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  labelText: Ult.Styles.Text({
    margin: 8,
    fontSize: CommonStyles.generalFontSize,
  }),
  testContainer: Ult.Styles.Text({
    backgroundColor: '#eee',
    borderColor: 'black',
    borderWidth: 1,
    margin: 20,
  }),

  row: Ult.Styles.View({
    flexDirection: 'row'
  }),
  outerPointerEventsBox: Ult.Styles.View({
    width: 200,
    height: 200,
    backgroundColor: '#AAAAAA',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  outerPointerEventsBoxHover: Ult.Styles.View({
    width: 200,
    height: 200,
    backgroundColor: 'yellow',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  innerPointerEventsBox: Ult.Styles.View({
    width: 100,
    height: 100,
    backgroundColor: '#333333',
    justifyContent: 'center',
    alignItems: 'center'
  }),
  innerPointerEventsBoxHover: Ult.Styles.View({
    width: 100,
    height: 100,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center'
  })
};

interface MouseViewState {
  mouseEnterEvent?: Ult.Types.MouseEvent;
  mouseLeaveEvent?: Ult.Types.MouseEvent;
  mouseOverEvent?: Ult.Types.MouseEvent;
  mouseMoveEvent?: Ult.Types.MouseEvent;
  blockPointerEvents: boolean;
  ignorePointerEvents: boolean;
  mouseOverOuter: boolean;
  mouseOverInner: boolean;
}

class MouseView extends Ult.Component<Ult.CommonProps, MouseViewState> {

  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      blockPointerEvents: false,
      ignorePointerEvents: false,
      mouseOverOuter: false,
      mouseOverInner: false
    };
  }

  private static getMouseEventText(mouseEvent?: Ult.Types.MouseEvent): string {
    if (mouseEvent) {
      return 'altKey = ' + mouseEvent.altKey +
        ' button = ' + mouseEvent.button +
        ' clientX = ' + mouseEvent.clientX +
        ' clientY = ' + mouseEvent.clientY +
        ' ctrlKey = ' + mouseEvent.ctrlKey +
        ' metaKey = ' + mouseEvent.metaKey +
        ' shiftKey = ' + mouseEvent.shiftKey +
        ' pageX = ' + mouseEvent.pageX +
        ' pageY = ' + mouseEvent.pageY;
    }
    return 'N/A';
  }

  private toggleBlockPointerEvents = () => {
    this.setState((prevState) => ({
      blockPointerEvents: !prevState.blockPointerEvents
    }));
  }

  private toggleIgnorePointerEvents = () => {
    this.setState((prevState) => ({
      ignorePointerEvents: !prevState.ignorePointerEvents
    }));
  }

  private onOuterMouseEnter = () => {
    this.setState({mouseOverOuter: true});
  }
  private onOuterMouseLeave = () => {
    this.setState({mouseOverOuter: false});
  }  
  private onInnerMouseEnter = (e: Ult.Types.MouseEvent) => {
    this.setState({mouseOverInner: true});
  }
  private onInnerMouseLeave = (e: Ult.Types.MouseEvent) => {
    this.setState({mouseOverInner: false});
  }

  render(): any {
    return (
      <Ult.View>
        <Ult.View style={_styles.explainTextContainer}>
          <Ult.Text style={_styles.explainText}>
            {'The view below shows textual representation of the last mouse events it has received.'}
          </Ult.Text>
        </Ult.View>
        <Ult.View
          style={_styles.testContainer}
          onMouseEnter={e => this.setState({mouseEnterEvent: _.clone(e)})}
          onMouseLeave={e => this.setState({mouseLeaveEvent: _.clone(e)})}
          onMouseOver={e => this.setState({mouseOverEvent: _.clone(e)})}
          onMouseMove={e => this.setState({mouseMoveEvent: _.clone(e)})}>
          <Ult.Text style={_styles.labelText}>
            {'onMouseEnter: ' + MouseView.getMouseEventText(this.state.mouseEnterEvent)}
          </Ult.Text>
          <Ult.Text style={_styles.labelText}>
            {'onMouseLeave: ' + MouseView.getMouseEventText(this.state.mouseLeaveEvent)}
          </Ult.Text>
          <Ult.Text style={_styles.labelText}>
            {'onMouseOver: ' + MouseView.getMouseEventText(this.state.mouseOverEvent)}
          </Ult.Text>
          <Ult.Text style={_styles.labelText}>
            {'onMouseMove: ' + MouseView.getMouseEventText(this.state.mouseMoveEvent)}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={_styles.explainTextContainer}>
          <Ult.Text style={_styles.explainText}>
            The views below are designed to test View.blockPointerEvents and View.ignorePointerEvents. 
            Each view changes color when the mouse hovers over it.
          </Ult.Text>
          <Ult.Text style={_styles.explainText}>
            blockPointerEvents is applied to the outer view. When it is enabled, mouse events should be blocked
            on both views and neither view should change color on hover.
          </Ult.Text>
          <Ult.Text style={_styles.explainText}>
            ignorePointerEvents is applied to the outer view. When it is enabled, mouse events should only be blocked
            on the outer view. The inner view should trigger color changes on both views as the mouse events cascade upwards.
          </Ult.Text>
        </Ult.View>
        <Ult.View 
          style={this.state.mouseOverOuter ? _styles.outerPointerEventsBoxHover : _styles.outerPointerEventsBox}
          blockPointerEvents={this.state.blockPointerEvents}
          ignorePointerEvents={this.state.ignorePointerEvents}
          onMouseEnter={this.onOuterMouseEnter} 
          onMouseLeave={this.onOuterMouseLeave}>
          <Ult.Text>Outer View</Ult.Text>
          <Ult.View style={this.state.mouseOverInner ? _styles.innerPointerEventsBoxHover : _styles.innerPointerEventsBox}
            onMouseEnter={this.onInnerMouseEnter} 
            onMouseLeave={this.onInnerMouseLeave}>
            <Ult.Text>Inner View</Ult.Text>
          </Ult.View>
        </Ult.View>
        <Ult.View style={_styles.row}>
          <Ult.Text style={_styles.labelText}>
            {'blockPointerEvents:' + (this.state.blockPointerEvents ? 'true' : 'false')}
          </Ult.Text>
          <Ult.Button onPress={this.toggleBlockPointerEvents}>
            <Ult.Text style={_styles.labelText}>
              {this.state.blockPointerEvents ? 'Enable' : 'Disable'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
        <Ult.View style={_styles.row}>
          <Ult.Text style={_styles.labelText}>
            ignorePointerEvents: {this.state.ignorePointerEvents ? 'true' : 'false'}
          </Ult.Text>
          <Ult.Button onPress={this.toggleIgnorePointerEvents}>
            <Ult.Text style={_styles.labelText}>
              {this.state.ignorePointerEvents ? 'Enable' : 'Disable'}
            </Ult.Text>
          </Ult.Button>
        </Ult.View>
      </Ult.View>
    );
  }
}

class ViewMouseTest implements Test {
  getPath(): string {
    return 'Components/View/Mouse';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return (
      <MouseView
        ref={onMount}
      />
    );
  }
}

export default new ViewMouseTest();
