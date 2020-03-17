/*
 * Interfaces.ts
 *
 * Interface exposed by Svg component.
 */

import * as React from 'react';
import * as Types from './Types';

export abstract class Svg extends React.Component<Types.SvgProps, any> {
}

export abstract class SvgPath extends React.Component<Types.SvgPathProps, any> {
}

export abstract class SvgRect extends React.Component<Types.SvgRectProps, any> {
}

export interface PluginInterface {
  Types: typeof Types;
  default: typeof Svg;
  SvgPath: typeof SvgPath;
  SvgRect: typeof SvgRect;
}
