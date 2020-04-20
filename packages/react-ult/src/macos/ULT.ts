/**
* ULT.ts
*
* Wrapper for all ULT functionality. Users of ULT should import just this
* file instead of internals.
*/

import React = require('react');
import RN = require('react-native');

import AccessibilityUtil from '../native-common/AccessibilityUtil';
import ActivityIndicatorImpl from '../native-common/ActivityIndicator';
import AlertImpl from '../native-common/Alert';
import { CommonAnimatedClasses, makeAnimated } from '../native-common/Animated';
import AppImpl from '../native-common/App';
import ButtonImpl from '../native-common/Button';
import ClipboardImpl from '../native-common/Clipboard';
import ImageImpl from '../native-common/Image';
import UltInterfaces = require('../common/Interfaces');
import InternationalImpl from '../native-common/International';
import LinkImpl from '../native-common/Link';
import LocationImpl from '../common/Location';
import ModalImpl from '../native-common/Modal';
import RXModuleInterface = require('../common/ModuleInterface');
import PickerImpl from '../native-common/Picker';
import PlatformImpl from '../native-common/Platform';
import PopupImpl from '../native-common/Popup';
import ScrollViewImpl from '../native-desktop/ScrollView';
import StorageImpl from '../native-common/Storage';
import StylesImpl from '../native-common/Styles';
import TextImpl from '../native-common/Text';
import TextInputImpl from '../native-common/TextInput';
import RXTypes = require('../common/Types');
import UserInterfaceImpl from '../native-common/UserInterface';
import UserPresenceImpl from '../native-common/UserPresence';

import AccessibilityImpl from './Accessibility';
import AccessibilityPlatformUtil from './AccessibilityUtil';
import GestureViewImpl from './GestureView';
import InputImpl from './Input';
import LinkingImpl from './Linking';
import StatusBarImpl from './StatusBar';
import ViewImpl from './View';

AccessibilityUtil.setAccessibilityPlatformUtil(AccessibilityPlatformUtil);

// -- STRANGE THINGS GOING ON HERE --
// See web/ULT.tsx for more details.

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

    const macAnimatedClasses =  {
        ...CommonAnimatedClasses,
        TextInput: RN.Animated.createAnimatedComponent(TextInputImpl),
        View: RN.Animated.createAnimatedComponent(ViewImpl),
    };

    export const Animated = makeAnimated(macAnimatedClasses);
    export import CommonProps = RXTypes.CommonProps;
    export import CommonStyledProps = RXTypes.CommonStyledProps;
    export import Stateless = RXTypes.Stateless;
    export import Types = RXTypes;

    export import Component = React.Component;
    export import ComponentBase = RXTypes.ComponentBase;
    export import createElement = React.createElement;
    export import Children = React.Children;
    export let __spread = (React as any).__spread;
    export import Fragment = React.Fragment;
}

// -- STRANGE THINGS GOING ON HERE --
// See web/ULT.tsx for more details.

let _rxImplementsRxInterface: typeof RXModuleInterface.ULT = ULT;
_rxImplementsRxInterface = _rxImplementsRxInterface;
export = ULT;

/*
var rx = module.exports;
Object.keys(rx)
    .filter(key => rx[key] && rx[key].prototype instanceof React.Component && !rx[key].displayName)
    .forEach(key => rx[key].displayName = 'RX.' + key + '');
*/
