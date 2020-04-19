/*
 * Types.ts
 *
 * Type definitions to support the plugin.
 */

import {Types as UltTypes} from 'react-ult';
import * as React from 'react';

export interface SvgStyle extends UltTypes.ViewStyle {
}

export declare type SvgStyleRuleSet = UltTypes.StyleRuleSet<SvgStyle>;

export interface SvgCommonProps {
  key?: string | number;
  strokeColor?: string;
  strokeWidth?: number;
  strokeOpacity?: number;
  fillColor?: string;
  fillOpacity?: number;
}

export interface SvgProps extends SvgCommonProps, UltTypes.CommonStyledProps<SvgStyleRuleSet, Svg> {
  children?: UltTypes.ReactNode;
  height: number;
  width: number;
  accessibilityLabel?: string;
  title?: string;
  viewBox?: string;
  preserveAspectRatio?: string;
  webShadow?: string;
}

export interface SvgPathProps extends SvgCommonProps {
  d?: string;
}

export interface SvgRectProps extends SvgCommonProps {
  width: number;
  height: number;
  x: number;
  y: number;
}

export class Svg extends React.Component<SvgProps, UltTypes.Stateless> {}
