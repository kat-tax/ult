/**
 * ModuleInterface.ts
 *
 * Defines a common base module type information set for all platforms to implement.
 */

import * as React from 'react';

import * as Ult from './Interfaces';

export declare module ULT {
  export type Accessibility = Ult.Accessibility;
  export let Accessibility: Ult.Accessibility;
  export type ActivityIndicator = Ult.ActivityIndicator;
  export let ActivityIndicator: typeof Ult.ActivityIndicator;
  export type Alert = Ult.Alert;
  export let Alert: Ult.Alert;
  export type App = Ult.App;
  export let App: Ult.App;
  export type Button = Ult.Button;
  export let Button: typeof Ult.Button;
  export type Picker = Ult.Picker;
  export let Picker: typeof Ult.Picker;
  export type Clipboard = Ult.Clipboard;
  export let Clipboard: Ult.Clipboard;
  export type GestureView = Ult.GestureView;
  export let GestureView: typeof Ult.GestureView;
  export type Image = Ult.Image;
  export let Image: Ult.ImageConstructor;
  export type Input = Ult.Input;
  export let Input: Ult.Input;
  export type International = Ult.International;
  export let International: Ult.International;
  export type Link = Ult.Link;
  export let Link: typeof Ult.Link;
  export type Linking = Ult.Linking;
  export let Linking: Ult.Linking;
  export type Location = Ult.Location;
  export let Location: Ult.Location;
  export type Modal = Ult.Modal;
  export let Modal: Ult.Modal;
  export type Platform = Ult.Platform;
  export let Platform: Ult.Platform;
  export type Popup = Ult.Popup;
  export let Popup: Ult.Popup;
  export type ScrollView = Ult.ScrollView;
  export let ScrollView: Ult.ScrollViewConstructor;
  export type StatusBar = Ult.StatusBar;
  export let StatusBar: Ult.StatusBar;
  export type Storage = Ult.Storage;
  export let Storage: Ult.Storage;
  export type Styles = Ult.Styles;
  export let Styles: Ult.Styles;
  export type Text = Ult.Text;
  export let Text: typeof Ult.Text;
  export type TextInput = Ult.TextInput;
  export let TextInput: typeof Ult.TextInput;
  export type UserInterface = Ult.UserInterface;
  export let UserInterface: Ult.UserInterface;
  export type UserPresence = Ult.UserPresence;
  export let UserPresence: Ult.UserPresence;
  export type View = Ult.View;
  export let View: typeof Ult.View;

  export type Animated = Ult.Animated;
  export let Animated: Ult.Animated;

  export import CommonProps = Ult.Types.CommonProps;
  export import CommonStyledProps = Ult.Types.CommonStyledProps;
  export import Types = Ult.Types;

  export import Component = React.Component;
  export let createElement: typeof React.createElement;
  export let Children: typeof React.Children;
  export let __spread: any;
}
