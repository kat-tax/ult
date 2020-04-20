/**
 * Animated.tsx
 *
 * RN-specific implementation of the cross-platform Animation abstraction.
 */

import * as React from 'react';
import * as RN from 'react-native';

import Easing from '../common/Easing';
import * as Ult from '../common/Interfaces';

import RXImage from './Image';
import RXText from './Text';
import RXTextInput from './TextInput';
import RXView from './View';

export interface AnimatedClasses {
    Image: typeof RN.ReactNativeBaseComponent;
    Text: typeof RN.ReactNativeBaseComponent;
    TextInput: typeof RN.ReactNativeBaseComponent;
    View: typeof RN.ReactNativeBaseComponent;
}

export const CommonAnimatedClasses: AnimatedClasses = {
    Image: RN.Animated.createAnimatedComponent(RXImage) as typeof RN.ReactNativeBaseComponent,
    Text: RN.Animated.createAnimatedComponent(RXText) as typeof RN.ReactNativeBaseComponent,
    TextInput: RN.Animated.createAnimatedComponent(RXTextInput) as typeof RN.ReactNativeBaseComponent,
    View: RN.Animated.createAnimatedComponent(RXView)  as typeof RN.ReactNativeBaseComponent,
};

let animatedClasses: AnimatedClasses = CommonAnimatedClasses;

class AnimatedWrapper<P, T, C> extends Ult.AnimatedComponent<P, T, C> {
    protected _mountedComponent: RN.ReactNativeBaseComponent<any, any> | undefined;

    setNativeProps(props: P) {
        if (this._mountedComponent && this._mountedComponent.setNativeProps) {
            this._mountedComponent.setNativeProps(props);
        }
    }

    focus() {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.focus) {
            innerComponent.focus();
        }
    }

    requestFocus() {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.requestFocus) {
            innerComponent.requestFocus();
        }
    }

    blur() {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.blur) {
            innerComponent.blur();
        }
    }

    protected _onMount = (component: RN.ReactNativeBaseComponent<any, any> | null) => {
        this._mountedComponent = component || undefined;
    };
}

class AnimatedImage extends AnimatedWrapper<Ult.Types.AnimatedImageProps, Ult.Types.Stateless, Ult.AnimatedImage> {
    render() {
        const additionalProps = { ref: this._onMount, style: this.props.style };
        return (
            <animatedClasses.Image
                { ...this.props }
                { ... additionalProps }
            >
                { this.props.children }
            </animatedClasses.Image>
        );
    }
}

class AnimatedText extends AnimatedWrapper<Ult.Types.AnimatedTextProps, Ult.Types.Stateless, Ult.AnimatedText>  {
    render() {
        const additionalProps = { ref: this._onMount, style: this.props.style };
        return (
            <animatedClasses.Text
                { ...this.props }
                { ... additionalProps }
            >
                { this.props.children }
            </animatedClasses.Text>
        );
    }
}

class AnimatedTextInput extends AnimatedWrapper<Ult.Types.AnimatedTextInputProps, Ult.Types.Stateless, Ult.AnimatedTextInput>   {
    render() {
        const additionalProps = {ref: this._onMount, style: this.props.style };
        return (
            <animatedClasses.TextInput
                { ...this.props }
                { ... additionalProps }
            >
                { this.props.children }
            </animatedClasses.TextInput>
        );
    }
}

class AnimatedView extends AnimatedWrapper<Ult.Types.AnimatedViewProps, Ult.Types.Stateless, Ult.AnimatedView> {
    setFocusRestricted(restricted: boolean) {
        // Nothing to do.
    }

    setFocusLimited(limited: boolean) {
        // Nothing to do.
    }

    render() {
        const additionalProps = {ref: this._onMount, style: this.props.style };
        return (
            <animatedClasses.View
                { ...this.props }
                { ... additionalProps }
            >
                { this.props.children }
            </animatedClasses.View>
        );
    }
}

class FocusRestrictedAnimatedView extends AnimatedView {
    setFocusRestricted(restricted: boolean) {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.setFocusRestricted) {
            innerComponent.setFocusRestricted(restricted);
        }
    }

    setFocusLimited(limited: boolean) {
        const innerComponent = this._mountedComponent ? (this._mountedComponent as any)._component : undefined;
        if (innerComponent && innerComponent.setFocusLimited) {
            innerComponent.setFocusLimited(limited);
        }
    }
}

const timing = function(
        value: Ult.Types.AnimatedValue,
        config: Ult.Types.Animated.TimingAnimationConfig): Ult.Types.Animated.CompositeAnimation {

    let isLooping = config.loop !== undefined && config.loop !== null;
    return {
        start: function(onEnd?: Ult.Types.Animated.EndCallback): void {
            function animate(): void {
                const timingConfig: RN.Animated.TimingAnimationConfig = {
                    toValue: config.toValue,
                    easing: config.easing ? config.easing.function : undefined,
                    duration: config.duration,
                    delay: config.delay,
                    isInteraction: config.isInteraction,
                    useNativeDriver: config.useNativeDriver,
                };

                RN.Animated.timing(value as RN.Animated.Value, timingConfig).start(result => {
                    if (onEnd) {
                        onEnd(result);
                    }

                    if (isLooping) {
                        value.setValue(config.loop!.restartFrom);
                        // Hack to get into the loop
                        animate();
                    }
                });
            }

            // Trigger animation loop (hack for now)
            animate();
        },

        stop: function(): void {
            isLooping = false;
            (value as any).stopAnimation();
        },
    };
};

export const AnimatedCommon = {
    Easing: Easing as Ult.Types.Animated.Easing,

    timing: timing,
    parallel: RN.Animated.parallel,
    sequence: RN.Animated.sequence,

    Value: RN.Animated.Value,
    createValue: (initialValue: number) => new RN.Animated.Value(initialValue),
    interpolate: (animatedValue: Ult.Types.AnimatedValue, inputRange: number[], outputRange: string[]) => animatedValue.interpolate({
        inputRange: inputRange,
        outputRange: outputRange,
    }),
};

export function makeAnimated(nativeAnimatedClasses: AnimatedClasses, useFocusRestrictedView?: boolean): Ult.Animated {
    if (nativeAnimatedClasses) {
        animatedClasses = nativeAnimatedClasses;
    }

    const animated: Ult.Animated = {
        // platform specific animated components
        Image: AnimatedImage,
        Text: AnimatedText,
        TextInput: AnimatedTextInput,
        View: useFocusRestrictedView ? FocusRestrictedAnimatedView :  AnimatedView,
        // common stuff
        ...AnimatedCommon,
    };

    return animated;
}

export default AnimatedCommon;
