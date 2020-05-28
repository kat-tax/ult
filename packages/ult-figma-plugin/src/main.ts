import {getCode} from './lib/convert';

// Config
const width = 340;
const height = 440;
const state = {
  editorValue: '',
  editorLoaded: false,
};

// Init
setInterval(onTick, 300);
figma.ui.on('message', onMessage);
figma.on('selectionchange', onTick);
figma.on('currentpagechange', onClose);
figma.on('close', onClose);
figma.showUI(__html__, {width, height});

// Events
function onTick() {
  const {selection} = figma.currentPage;
  const hasSelection = selection.length > 0;
  const getTarget = (selection: readonly SceneNode[]) => {
    let root: SceneNode | DocumentNode & ChildrenMixin = selection[0];
    if (root.type === 'COMPONENT')
      return selection[0] as ComponentNode;
    while (root.parent && root.parent.type !== 'PAGE') {
      root = root.parent;
      if (root.type === 'COMPONENT')
        return root;
    }
    return null;
  }
  
  const target = hasSelection && getTarget(selection);
  const code = target && getCode(target);
  const payload = code ? code : '';
  if (state.editorLoaded && payload !== state.editorValue) {
    state.editorValue = payload;
    figma.ui.postMessage({type: 'editor-value', payload});
  }
}

function onMessage(e: {type: string}) {
  switch (e.type) {
    case 'editor-init':
      state.editorLoaded = true;
      break;
  }
}

function onClose() {
  figma.closePlugin();
}
