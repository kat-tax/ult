/*
 * Interfaces.ts
 *
 * Interface definition for cross-platform ULT plugin for a control that allows the
 * display of an independent web page.
 */

import {Component as UltComponent, Types as UltTypes} from 'react-ult';
import * as Types from './Types';

export interface PluginInterface {
  Types: typeof Types;
  default: typeof Types.WebView;
}
