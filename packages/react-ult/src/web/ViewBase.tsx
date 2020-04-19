/**
 * ViewBase.tsx
 *
 * A base class for the Web-specific implementation of the cross-platform View abstraction.
 */

import * as Ult from '../common/Interfaces';
import AppConfig from '../common/AppConfig';
import {Defer} from '../common/utils/PromiseDefer';
import Timers from '../common/utils/Timers';
import FrontLayerViewManager from './FrontLayerViewManager';
import * as _ from './utils/lodashMini';

// We create a periodic timer to detect layout changes that are performed behind
// our back by the browser's layout engine. We do this more aggressively when
// the app is known to be active and in the foreground.
const _layoutTimerActiveDuration = 1000;
const _layoutTimerInactiveDuration = 10000;

export abstract class ViewBase<P extends Ult.Types.ViewPropsShared<C>, S, C extends Ult.View | Ult.ScrollView> extends Ult.ViewBase<P, S> {
  private static _viewCheckingTimer: number | undefined;
  private static _isResizeHandlerInstalled = false;
  private static _viewCheckingList: ViewBase<Ult.Types.ViewPropsShared<Ult.View | Ult.ScrollView>, any, Ult.View | Ult.ScrollView>[] = [];
  private static _appActivationState = Ult.Types.AppActivationState.Active;

  abstract render(): JSX.Element;
  protected abstract _getContainer(): HTMLElement | null;
  protected _isMounted = false;
  private _isPopupDisplayed = false;

  // Sets the activation state so we can stop our periodic timer
  // when the app is in the background.
  static setActivationState(newState: Ult.Types.AppActivationState) {
    if (ViewBase._appActivationState !== newState) {
      ViewBase._appActivationState = newState;

      // Cancel any existing timers.
      if (ViewBase._viewCheckingTimer) {
        Timers.clearInterval(ViewBase._viewCheckingTimer);
        ViewBase._viewCheckingTimer = undefined;
      }

      if (ViewBase._viewCheckingList.length > 0) {
        // If we're becoming active, check and report layout changes immediately.
        if (newState === Ult.Types.AppActivationState.Active) {
          ViewBase._checkViews();
        }

        ViewBase._viewCheckingTimer = Timers.setInterval(ViewBase._checkViews,
          newState === Ult.Types.AppActivationState.Active ?
            _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
      }
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps: Ult.Types.ViewPropsShared<C>) {
    if (!!this.props.onLayout !== !!nextProps.onLayout) {
      if (this.props.onLayout) {
        this._checkViewCheckerUnbuild();
      }

      if (nextProps.onLayout) {
        this._checkViewCheckerBuild();
      }
    }
  }

  protected static _checkViews() {
    _.each(ViewBase._viewCheckingList, view => {
      view._checkAndReportLayout().catch(e => {
        console.warn('ScrollView onLayout exception: ' + JSON.stringify(e));
      });
    });
  }

  private static _layoutReportList: Function[] = [];
  private static _layoutReportingTimer: number | undefined;
  private static _reportLayoutChange(func: Function) {
    this._layoutReportList.push(func);

    if (!ViewBase._layoutReportingTimer) {
      ViewBase._layoutReportingTimer = Timers.setTimeout(() => {
        ViewBase._layoutReportingTimer = undefined;
        ViewBase._reportDeferredLayoutChanges();
      }, 0);
    }
  }

  protected static _reportDeferredLayoutChanges() {
    const reportList = this._layoutReportList;
    this._layoutReportList = [];

    _.each(reportList, func => {
      try {
        func();
      } catch (e) {
        if (AppConfig.isDevelopmentMode()) {
          console.error('Caught exception on onLayout response: ', e);
        }
      }
    });
  }

  protected _lastX = 0;
  protected _lastY = 0;
  protected _lastWidth = 0;
  protected _lastHeight = 0;

  // Returns a promise to indicate when firing of onLayout event has completed (if any)
  protected _checkAndReportLayout(): Promise<void> {
    if (!this._isMounted) {
      return Promise.resolve(void 0);
    }

    const container = this._getContainer();
    if (!container) {
      return Promise.resolve(void 0);
    }

    const newX = container.offsetLeft;
    const newY = container.offsetTop;
    const marginTop = !container.style.marginTop ? 0 : parseInt(container.style.marginTop, 10) || 0;
    const marginBottom = !container.style.marginBottom ? 0 : parseInt(container.style.marginBottom, 10) || 0;
    const marginRight = !container.style.marginRight ? 0 : parseInt(container.style.marginRight, 10) || 0;
    const marginLeft = !container.style.marginLeft ? 0 : parseInt(container.style.marginLeft, 10) || 0;
    const newWidth = container.offsetWidth + marginRight + marginLeft;
    const newHeight = container.offsetHeight + marginTop + marginBottom;

    if (this._lastX !== newX || this._lastY !== newY || this._lastWidth !== newWidth || this._lastHeight !== newHeight) {
      this._lastX = newX;
      this._lastY = newY;
      this._lastWidth = newWidth;
      this._lastHeight = newHeight;

      const deferred = new Defer<void>();
      ViewBase._reportLayoutChange(() => {
        if (!this._isMounted || !this.props.onLayout) {
          deferred.resolve(void 0);
          return;
        }

        this.props.onLayout({
          x: newX,
          y: newY,
          width: this._lastWidth,
          height: this._lastHeight
        });
        deferred.resolve(void 0);
      });
      return deferred.promise();
    }

    return Promise.resolve(void 0);
  }

  private _checkViewCheckerBuild() {
    // Enable the timer to check for layout changes. Use a different duration
    // when the app is active versus inactive.
    if (!ViewBase._viewCheckingTimer) {
      ViewBase._viewCheckingTimer = Timers.setInterval(ViewBase._checkViews,
        ViewBase._appActivationState === Ult.Types.AppActivationState.Active ?
          _layoutTimerActiveDuration : _layoutTimerInactiveDuration);
    }

    if (!ViewBase._isResizeHandlerInstalled) {
      window.addEventListener('resize', ViewBase._onResize);
      ViewBase._isResizeHandlerInstalled = true;
    }

    ViewBase._viewCheckingList.push(this);
  }

  private _checkViewCheckerUnbuild() {
    ViewBase._viewCheckingList = _.filter(ViewBase._viewCheckingList, v => v !== this);

    if (ViewBase._viewCheckingList.length === 0) {
      if (ViewBase._viewCheckingTimer) {
        Timers.clearInterval(ViewBase._viewCheckingTimer);
        ViewBase._viewCheckingTimer = undefined;
      }

      if (ViewBase._isResizeHandlerInstalled) {
        window.removeEventListener('resize', ViewBase._onResize);
        ViewBase._isResizeHandlerInstalled = false;
      }
    }
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.props.onLayout) {
      this._checkViewCheckerBuild();
    }

    // Chain through to the same render-checking code
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const isPopupDisplayed = FrontLayerViewManager.isPopupDisplayed();
    if (this.props.onLayout) {
      if (isPopupDisplayed && !this._isPopupDisplayed) {
        // A popup was just added to DOM. Checking layout now would stall script
        // execution because the browser would have to do a reflow. Avoid that
        // by deferring the work.
        setTimeout(() => {
          this._checkAndReportLayout().catch(e => {
            console.warn('ScrollView onLayout exception: ' + JSON.stringify(e));
          });
        }, 0);
      } else {
        this._checkAndReportLayout().catch(e => {
          console.warn('ScrollView onLayout exception: ' + JSON.stringify(e));
        });
      }
    }
    this._isPopupDisplayed = isPopupDisplayed;
  }

  private static _onResize() {
    // Often views change size in response to an overall window resize. Rather than
    // wait for the next timer to fire, do it immediately.
    ViewBase._checkViews();
  }

  componentWillUnmount() {
    this._isMounted = false;
    if (this.props.onLayout) {
      this._checkViewCheckerUnbuild();
    }
  }
}

export default ViewBase;
