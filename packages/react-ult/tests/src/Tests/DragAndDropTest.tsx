/*
* Tests the Drag and Drop in an interactive manner.
*/

import _ = require('lodash');
import Ult = require('react-ult');
import * as CommonStyles from '../CommonStyles';
import {Test, TestType} from '../Test';

const _styles = {
  container: Ult.Styles.View({
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'stretch'
  }),
  textContainer: Ult.Styles.View({
    margin: 12
  }),
  labelContainer: Ult.Styles.View({
    alignSelf: 'stretch',
    margin: 8,
    borderColor: CommonStyles.buttonBorderColor,
    borderStyle: 'solid',
    borderWidth: 1,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  labelContainerHover: Ult.Styles.View({
    backgroundColor: CommonStyles.buttonBorderColor
  }),
  explainText: Ult.Styles.Text({
    fontSize: CommonStyles.generalFontSize,
    color: CommonStyles.explainTextColor
  }),
  dragAndDropContainer: Ult.Styles.View({
    flexDirection: 'row',
    flex: 1,
    height: 70
  }),
  dragAndDropView: Ult.Styles.View({
    flex: 1,
    borderColor: CommonStyles.buttonBorderColor,
    borderStyle: 'solid',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  }),
  dragAndDropObject: Ult.Styles.View({
    height: 40,
    width: 40,
    backgroundColor: CommonStyles.successTextColor,
    marginTop: 5
  })
};

interface DragAndDropViewState {
  isFileDragAndDropHover: boolean;
  logViewDragAndDrop: string[];
  filesDropped: FileInfo[];
  isViewDragAndDropHover: boolean;
  viewDragStartDateAndTime: string;
}

interface FileInfo {
  fileName: string;
  fileSize: number;
}

class DragAndDropView extends Ult.Component<Ult.CommonProps, DragAndDropViewState> {
  constructor(props: Ult.CommonProps) {
    super(props);
    this.state = {
      isFileDragAndDropHover: false,
      logViewDragAndDrop: [],
      filesDropped: [],
      isViewDragAndDropHover: false,
      viewDragStartDateAndTime: ''
    };
  }

  render() {
    return (
      <Ult.View style={_styles.container}>
        <Ult.View style={_styles.textContainer} key={'explanation1'}>
          <Ult.Text style={_styles.explainText}>
            {'Drag one or more files over to the container below'}
          </Ult.Text>
        </Ult.View>
        <Ult.View 
          style={[
            _styles.labelContainer,
            this.state.isFileDragAndDropHover
              ? _styles.labelContainerHover
              : undefined
          ]}
          onDragEnter={this._onDragEnterForFiles}
          onDragLeave={this._onDragLeaveForFiles}
          onDragOver={this._onDragOverForFiles}
          onDrop={this._onDropForFiles}>
          <Ult.Text style={_styles.explainText}>
            {'Drop target'}
          </Ult.Text>
        </Ult.View>
        {this._renderDroppedFiles()}
        <Ult.View style={_styles.textContainer} key={'explanation2'}>
          <Ult.Text style={_styles.explainText}>
            {'Drag the square from the left side to the right side'}
          </Ult.Text>
        </Ult.View>
        <Ult.View style={[_styles.textContainer, _styles.dragAndDropContainer]}>
          <Ult.View style={[_styles.dragAndDropView, _styles.explainText]}>
            <Ult.View 
              onDragStart={this._onDragStartForViews}
              style={_styles.dragAndDropObject}>
            </Ult.View>
          </Ult.View>
          <Ult.View style={_styles.dragAndDropView}>
            <Ult.Text style={_styles.explainText}>
              {'Not allowed to drop here'}
            </Ult.Text>
          </Ult.View>
          <Ult.View 
            style={[
              _styles.dragAndDropView,
              this.state.isViewDragAndDropHover
                ? _styles.labelContainerHover
                : undefined
            ]}
            onDragEnter={this._onDragEnterForViews}
            onDragLeave={this._onDragLeaveForViews}
            onDragOver={this._onDragOverForViews}
            onDrop={this._onDropForViews}>
            <Ult.Text style={_styles.explainText}>
              {'Drop target'}
            </Ult.Text>
          </Ult.View>
        </Ult.View>
        {this._renderViewDragStart()}
      </Ult.View>
    );
  }

  private _renderDroppedFiles(): JSX.Element | undefined {
    if (this.state.filesDropped.length === 0) {
      return undefined;
    }

    let filesInfo: JSX.Element[] = [];
    _.each(this.state.filesDropped, fileInfo => {
      filesInfo.push(this._formatFileInfo(fileInfo));
    });

    return (
      <Ult.View style={_styles.textContainer} key={' droppedFiles '}>
        <Ult.Text style={_styles.explainText}>
          {'You dropped'}
        </Ult.Text>
        {filesInfo}
      </Ult.View>
    );
  }

  private _formatFileInfo(file: FileInfo): JSX.Element {
    return (
      <Ult.Text key={file.fileName} style={_styles.explainText}>
        {file.fileName + ', size: ' + file.fileSize + 'kb'}
      </Ult.Text>
    );
  }

  private _renderViewDragStart(): JSX.Element | undefined {
    if (this.state.viewDragStartDateAndTime === '') {
      return undefined;
    }

    return (
      <Ult.View style={_styles.textContainer} key={' droppedView '}>
        <Ult.Text style={_styles.explainText} key={'drag'}>
          {'You started dragging at ' + this.state.viewDragStartDateAndTime}
        </Ult.Text>
        <Ult.Text style={_styles.explainText} key={'drop'}>
          {'You dropped at ' + new Date().toLocaleTimeString()}
        </Ult.Text>
      </Ult.View>
    );
  }

  private _onDragEnterForFiles = (e: Ult.Types.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({isFileDragAndDropHover: true});
  }

  private _onDragLeaveForFiles = (e: Ult.Types.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({isFileDragAndDropHover: false});
  }

  private _onDragOverForFiles = (e: Ult.Types.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({isFileDragAndDropHover: true});
  }

  private _onDropForFiles = (e: Ult.Types.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let filesDropped: FileInfo[] = [];
    _.each(e.dataTransfer.files, fileData => {
      const fileInfo: FileInfo = {
        fileName: fileData.name,
        fileSize: Math.round(fileData.size / 1024)
      };
      filesDropped.push(fileInfo);
    });
    this.setState({
      isFileDragAndDropHover: false,
      filesDropped: filesDropped
    });
  }

  private _onDragStartForViews = (e: Ult.Types.DragEvent) => {
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.setData('transferData', new Date().toLocaleTimeString());
  }

  private _onDragEnterForViews = (e: Ult.Types.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({isViewDragAndDropHover: true});
  }

  private _onDragLeaveForViews = (e: Ult.Types.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({isViewDragAndDropHover: false});
  }

  private _onDragOverForViews = (e: Ult.Types.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({isViewDragAndDropHover: true});
  }

  private _onDropForViews = (e: Ult.Types.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      isViewDragAndDropHover: false,
      viewDragStartDateAndTime: e.dataTransfer.getData('transferData')
    });
  }
}

class DragAndDropTest implements Test {
  getPath(): string {
    return 'APIs/DragAndDrop';
  }

  getTestType(): TestType {
    return TestType.Interactive;
  }

  render(onMount: (component: any) => void): Ult.Types.ReactNode {
    return <DragAndDropView ref={onMount}/>;
  }
}

export default new DragAndDropTest();
