import React, {useEffect} from 'react';
import {AppRegistry} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {I18nProvider} from '@lingui/react';
import {i18n} from '@lingui/core';
import {locales} from 'lib/config';
import {loadLocale} from 'lib/i18n';
import {Navigator} from 'ui/Navigator';

export function Main() {
  useEffect(() => {
    loadLocale(locales.default);
  }, []);
  return (
    <I18nProvider i18n={i18n} forceRenderOnLocaleChange={false}>
      <SafeAreaProvider>
        <Navigator/>
      </SafeAreaProvider>
    </I18nProvider>
  );
}

const rootName = 'main';
const rootTag = document.getElementById(rootName);

AppRegistry.registerComponent(rootName, () => Main);
AppRegistry.runApplication(rootName, {rootTag});
