/**
 * App.tsx
 *
 * Implements App interface for ULT.
 */

import * as Ult from '../common/Interfaces';
import AppVisibilityUtils from './utils/AppVisibilityUtils';

export class App extends Ult.App {
  private _activationState: Ult.Types.AppActivationState;
  constructor() {
    super();
    // Handle test environment where document is not defined.
    if (typeof(document) !== 'undefined') {
      this._activationState = AppVisibilityUtils.isAppInForeground() ?
      Ult.Types.AppActivationState.Active : Ult.Types.AppActivationState.Background;
      AppVisibilityUtils.onAppForegroundedEvent.subscribe(() => {
        this._setActivationState(Ult.Types.AppActivationState.Active);
      });
      AppVisibilityUtils.onAppBackgroundedEvent.subscribe(() => {
        this._setActivationState(Ult.Types.AppActivationState.Background);
      });
    } else {
      this._activationState = Ult.Types.AppActivationState.Active;
    }
  }

  initialize(debug: boolean, development: boolean) {
    super.initialize(debug, development);
  }

  getActivationState(): Ult.Types.AppActivationState {
    return this._activationState;
  }

  private _setActivationState = (currentState: Ult.Types.AppActivationState) => {
    if (this._activationState !== currentState) {
      this._activationState = currentState;
      this.activationStateChangedEvent.fire(this._activationState);
    }
  }
}

export default new App();
