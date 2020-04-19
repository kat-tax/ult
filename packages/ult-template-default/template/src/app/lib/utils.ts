import {Platform} from 'react-ult';

const _platform = Platform.getType();

export function isTouch() {
  switch (_platform) {
    case 'android': return true;
    case 'ios': return true;
    case 'macos': return false;
    case 'windows': return false;
    case 'web': return navigator && navigator.maxTouchPoints > 0;
    default: return false;
  }
}

export function isAndroid() {
  return _platform === 'android';
}

export function isIOS() {
  return _platform === 'ios';
}

export function isMacOS() {
  return _platform === 'macos';
}

export function isWindows() {
  return _platform === 'windows';
}

export function isWeb() {
  return _platform === 'web';
}

export function isNative() {
  return isAndroid() || isIOS() || isMacOS() || isWindows();
}
