/**
 * App.tsx
 *
 * Windows implementation of App API namespace.
 */

import {ComponentProvider} from 'react-native';
import {App as AppCommon} from '../native-common/App';
import {RootView, RootViewUsingProps} from './RootView';

export class App extends AppCommon {
  protected getRootViewFactory(): ComponentProvider {
    return () => RootView;
  }

  protected getRootViewUsingPropsFactory(): ComponentProvider {
    return () => RootViewUsingProps;
  }
}

export default new App();
