/**
 * ViewBase.tsx
 *
 * Base class that is used for several RX views.
 */

import * as RN from 'react-native';

import * as Ult from '../common/Interfaces';

import { isEqual } from './utils/lodashMini';

export abstract class ViewBase<
    P extends Ult.Types.ViewPropsShared<C>,
    S,
    T extends RN.View | RN.ScrollView,
    C extends Ult.View | Ult.ScrollView
> extends Ult.ViewBase<P, S> {

    protected static readonly _supportsNativeFocusBlur = RN.Platform.OS !== 'android';
    private static _defaultViewStyle: Ult.Types.ViewStyleRuleSet | undefined;
    private _layoutEventValues: Ult.Types.ViewOnLayoutEvent | undefined;

    abstract render(): JSX.Element;
    protected _nativeComponent: T | undefined;

    static setDefaultViewStyle(defaultViewStyle: Ult.Types.ViewStyleRuleSet) {
        ViewBase._defaultViewStyle = defaultViewStyle;
    }

    static getDefaultViewStyle() {
        return ViewBase._defaultViewStyle;
    }

    // To be able to use View inside TouchableHighlight/TouchableOpacity
    setNativeProps(nativeProps: RN.ViewProps) {
        // We know that View and ScrollView both has setNative props even if the typings don't exist
        const nativeComponent = this._nativeComponent as any as RN.ReactNativeBaseComponent<any, any> | null;
        if (nativeComponent && nativeComponent.setNativeProps) {
            nativeComponent.setNativeProps(nativeProps);
        }
    }

    protected _setNativeComponent = (view: T | null) => {
        this._nativeComponent = view || undefined;
    };

    protected _getStyles(props: Ult.Types.ViewProps) {
        // If this platform uses an explicit default view style, push it on to
        // the front of the list of provided styles.
        if (ViewBase._defaultViewStyle) {
            return [ViewBase._defaultViewStyle, props.style];
        }

        return props.style;
    }

    protected _onLayout = (event: RN.LayoutChangeEvent) => {
        if (this.props.onLayout) {
            const layoutEventValues = {
                x: event.nativeEvent.layout.x,
                y: event.nativeEvent.layout.y,
                width: event.nativeEvent.layout.width,
                height: event.nativeEvent.layout.height,
            };

            // Only fire the onLayout callback if the layout values change
            if (!isEqual(this._layoutEventValues, layoutEventValues)) {
                this.props.onLayout(layoutEventValues);
                this._layoutEventValues = layoutEventValues;
            }
        }
    };
}

export default ViewBase;
