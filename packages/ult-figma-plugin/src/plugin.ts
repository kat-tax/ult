import {getCode} from './convert';

figma.ui.on('message', onMessage);
figma.on('selectionchange', onUpdate);
figma.on('currentpagechange', onNavigate);
figma.showUI(__html__, {width: 340, height: 440});
setInterval(onUpdate, 500);

let EDITOR_LOADED = false;
let EDITOR_VALUE = '';

function onUpdate() {
  const {selection} = figma.currentPage;
  const hasSelection = selection.length > 0;
  const getTarget = (selection: readonly SceneNode[]) => {
    let root: SceneNode | DocumentNode & ChildrenMixin = selection[0];
    if (root.type === 'COMPONENT') return selection[0] as ComponentNode;
    while (root.parent && root.parent.type !== 'PAGE') {
      root = root.parent;
      if (root.type === 'COMPONENT') return root;
    }
    return null;
  }
  
  const target = hasSelection && getTarget(selection);
  const code = target && getCode(target);
  const payload = code ? code : '';
  if (EDITOR_LOADED && payload !== EDITOR_VALUE) {
    EDITOR_VALUE = payload;
    figma.ui.postMessage({type: 'editor-value', payload});
  }
}

function onMessage(e: {type: string}) {
  switch (e.type) {
    case 'editor-init':
      EDITOR_LOADED = true;
      break;
  }
}

function onNavigate() {
  figma.closePlugin();
}
