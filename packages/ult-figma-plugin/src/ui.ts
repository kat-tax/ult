import './ui.css';

const info = document.getElementById('info');
const hint = document.getElementById('hint');
const editor = document.getElementById('editor');
const loading = document.getElementById('loading');
const state = {
  content: '',
  loading: true,
}

function onLoad() {
  parent.postMessage({pluginMessage: {type: 'editor-init'}}, '*');
  loading.style.display = 'none';
  hint.style.display = 'flex';
}

function onMessage(e: any) {
  const {type, payload} = e.data.pluginMessage;
  switch (type) {
    case 'editor-value':
      if (state.loading) editor.style.opacity = '1.0';
      state.content = payload;
      state.loading = !payload;
      frames['editor'].postMessage(`\n${payload}\n`, '*');
      if (state.loading) {
        info.style.display = '';
        hint.style.display = '';
      } else {
        info.style.display = 'none';
      }
      break;
  }
}

editor.onload = onLoad;
window.onmessage = onMessage;
