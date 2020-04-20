/**
 * App.tsx
 *
 * Native implementation of App API namespace.
 */

import * as RN from 'react-native';

import * as Ult from '../common/Interfaces';

import { RootView, RootViewUsingProps } from './RootView';
import UserInterface from './UserInterface';

const _rnStateToUltState: {[key: string]: Ult.Types.AppActivationState} = {
    'unknown': Ult.Types.AppActivationState.Active,
    'active': Ult.Types.AppActivationState.Active,
    'background': Ult.Types.AppActivationState.Background,
    'inactive': Ult.Types.AppActivationState.Inactive,
    'extension': Ult.Types.AppActivationState.Extension,
    // uninitialized means in Background on android since last change I did
    'uninitialized': Ult.Types.AppActivationState.Background,
};

export class App extends Ult.App {
    constructor() {
        super();

        RN.AppState.addEventListener('change', (newState: string) => {
            // Fall back to active if a new state spits out that we don't know about
            this.activationStateChangedEvent.fire(_rnStateToUltState[newState] || Ult.Types.AppActivationState.Active);
        });

        RN.AppState.addEventListener('memoryWarning', () => {
            this.memoryWarningEvent.fire();
        });
    }

    initialize(debug: boolean, development: boolean): void {
        super.initialize(debug, development);
        window.ultdebug = debug;
        RN.AppRegistry.registerComponent('UltApp', this.getRootViewFactory());
        UserInterface.registerRootViewUsingPropsFactory(this.getRootViewUsingPropsFactory());
    }

    getActivationState(): Ult.Types.AppActivationState {
        return _rnStateToUltState[RN.AppState.currentState] || Ult.Types.AppActivationState.Active;
    }

    protected getRootViewFactory(): RN.ComponentProvider {
        return () => RootView;
    }

    protected getRootViewUsingPropsFactory(): RN.ComponentProvider {
        return () => RootViewUsingProps;
    }
}

export default new App();
