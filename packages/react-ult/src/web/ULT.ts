/**
* ULT.ts
*
* Wrapper for all ULT functionality. Users of ULT should import just this
* file instead of internals.
*/

import React = require('react');

import { setSortAndFilterFunc } from '../common/utils/AutoFocusHelper';
import UltInterfaces = require('../common/Interfaces');
import LocationImpl from '../common/Location';
import UltModuleInterface = require('../common/ModuleInterface');
import PopupImpl from '../web/Popup';
import UltTypes = require('../common/Types');

import AccessibilityImpl from './Accessibility';
import { ActivityIndicator as ActivityIndicatorImpl } from './ActivityIndicator';
import AlertImpl from './Alert';
import AnimatedImpl = require('./Animated');
import AppImpl from './App';
import { Button as ButtonImpl } from './Button';
import ClipboardImpl from './Clipboard';
import FocusManager from './utils/FocusManager';
import { GestureView as GestureViewImpl } from './GestureView';
import { Image as ImageImpl } from './Image';
import InputImpl from './Input';
import InternationalImpl from './International';
import { Link as LinkImpl } from './Link';
import LinkingImpl from './Linking';
import ModalImpl from './Modal';
import { Picker as PickerImpl } from './Picker';
import PlatformImpl from './Platform';
import { ScrollView as ScrollViewImpl } from './ScrollView';
import StatusBarImpl from './StatusBar';
import StorageImpl from './Storage';
import StylesImpl from './Styles';
import { Text as TextImpl } from './Text';
import { TextInput as TextInputImpl } from './TextInput';
import UserInterfaceImpl from './UserInterface';
import UserPresenceImpl from './UserPresence';
import ViewImpl from './View';
import { ViewBase } from './ViewBase';
setSortAndFilterFunc(FocusManager.sortAndFilterAutoFocusCandidates);

// -- STRANGE THINGS GOING ON HERE --
//
// 1) 'export type Foo = FooImpl; export var Foo = FooImpl;'
//    If the var 'Foo' was exported alone then the name 'RX.Foo' would not be valid in a type position: 'function takesFoo(foo: RX.Foo)'.
//    To avoid this problem, the type information is also exported. TypeScript will merge the var and type together (if the types match).

module ULT {
    export type Accessibility = UltInterfaces.Accessibility;
    export let Accessibility: UltInterfaces.Accessibility = AccessibilityImpl;
    export type ActivityIndicator = UltInterfaces.ActivityIndicator;
    export let ActivityIndicator: typeof UltInterfaces.ActivityIndicator = ActivityIndicatorImpl;
    export type Alert = UltInterfaces.Alert;
    export let Alert: UltInterfaces.Alert = AlertImpl;
    export type App = UltInterfaces.App;
    export let App: UltInterfaces.App = AppImpl;
    export type Button = UltInterfaces.Button;
    export let Button: typeof UltInterfaces.Button = ButtonImpl;
    export type Picker = UltInterfaces.Picker;
    export let Picker: typeof UltInterfaces.Picker = PickerImpl;
    export type Clipboard = UltInterfaces.Clipboard;
    export let Clipboard: UltInterfaces.Clipboard = ClipboardImpl;
    export type GestureView = UltInterfaces.GestureView;
    export let GestureView: typeof UltInterfaces.GestureView = GestureViewImpl;
    export type Image = UltInterfaces.Image;
    export let Image: UltInterfaces.ImageConstructor = ImageImpl;
    export type Input = UltInterfaces.Input;
    export let Input: UltInterfaces.Input = InputImpl;
    export type International = UltInterfaces.International;
    export let International: UltInterfaces.International = InternationalImpl;
    export type Link = UltInterfaces.Link;
    export let Link: typeof UltInterfaces.Link = LinkImpl;
    export type Linking = UltInterfaces.Linking;
    export let Linking: UltInterfaces.Linking = LinkingImpl;
    export type Location = UltInterfaces.Location;
    export let Location: UltInterfaces.Location = LocationImpl;
    export type Modal = UltInterfaces.Modal;
    export let Modal: UltInterfaces.Modal = ModalImpl;
    export type Platform = UltInterfaces.Platform;
    export let Platform: UltInterfaces.Platform = PlatformImpl;
    export type Popup = UltInterfaces.Popup;
    export let Popup: UltInterfaces.Popup = PopupImpl;
    export type ScrollView = UltInterfaces.ScrollView;
    export let ScrollView: UltInterfaces.ScrollViewConstructor = ScrollViewImpl;
    export type StatusBar = UltInterfaces.StatusBar;
    export let StatusBar: UltInterfaces.StatusBar = StatusBarImpl;
    export type Storage = UltInterfaces.Storage;
    export let Storage: UltInterfaces.Storage = StorageImpl;
    export type Styles = UltInterfaces.Styles;
    export let Styles: UltInterfaces.Styles = StylesImpl;
    export type Text = UltInterfaces.Text;
    export let Text: typeof UltInterfaces.Text = TextImpl;
    export type TextInput = UltInterfaces.TextInput;
    export let TextInput: typeof UltInterfaces.TextInput = TextInputImpl;
    export type UserInterface = UltInterfaces.UserInterface;
    export let UserInterface: UltInterfaces.UserInterface = UserInterfaceImpl;
    export type UserPresence = UltInterfaces.UserPresence;
    export let UserPresence: UltInterfaces.UserPresence = UserPresenceImpl;
    export type View = UltInterfaces.View;
    export let View: typeof UltInterfaces.View = ViewImpl;

    export import Animated = AnimatedImpl;
    export import CommonProps = UltTypes.CommonProps;
    export import CommonStyledProps = UltTypes.CommonStyledProps;
    export import Stateless = UltTypes.Stateless;
    export import Types = UltTypes;

    export import Component = React.Component;
    export import ComponentBase = UltTypes.ComponentBase;
    export import createElement = React.createElement;
    export import Children = React.Children;
    export let __spread = (React as any).__spread;
    export import Fragment = React.Fragment;
}

ViewBase.setActivationState(AppImpl.getActivationState());
AppImpl.activationStateChangedEvent.subscribe(newState => {
    ViewBase.setActivationState(newState);
});

// -- STRANGE THINGS GOING ON HERE --
//
// 1) Unused variable
//    This forces TypeScript to type-check the above RX module against the common RX interface. Missing/incorrect types will cause errors.
//    Note: RX must be a module so 'RX.Foo' can be a valid value ('new RX.Foo') and valid type ('var k: RX.Foo'), but modules cannot
//    implement an interface. If RX was a class or variable then it could directly check this, but then 'RX.Foo' would not be a valid type.

let _ultImplementsUltInterface: typeof UltModuleInterface.ULT = ULT;
_ultImplementsUltInterface = _ultImplementsUltInterface;
export = ULT;

/*

var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
