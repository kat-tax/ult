import React, {useRef} from 'react';
import {useColorScheme} from 'react-native';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {useReduxDevToolsExtension} from '@react-navigation/devtools';
import {Default, DefaultDark} from 'lib/themes';
import {Home} from 'ui/stacks/Home';
import {t} from '@lingui/macro';

const Stack = createStackNavigator();

export function Navigator() {
  const ref = useRef<NavigationContainerRef>(null);
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const theme = isDark ? DefaultDark.nav : Default.nav;
  useReduxDevToolsExtension(ref);
  return (
    <NavigationContainer ref={ref} theme={theme}>
      <Stack.Navigator>
        <Stack.Screen name={t`Home`} component={Home}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
