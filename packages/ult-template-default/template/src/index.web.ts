// @ts-ignore
import MaterialIcons_ttf from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';

const style = document.createElement('style');
const iconCSS = `
@font-face {
  src: url(${MaterialIcons_ttf});
  font-family: MaterialIcons;
}
`;

// @ts-ignore
if (style.styleSheet) style.styleSheet.cssText = iconCSS;
else style.appendChild(document.createTextNode(iconCSS));
document.head.appendChild(style);

import 'ui/Main';

// Web metrics
import('web-vitals').then(({getCLS, getFID, getFCP, getLCP, getTTFB}) => {
  getCLS();
  getFID();
  getFCP();
  getLCP();
  getTTFB();
});
