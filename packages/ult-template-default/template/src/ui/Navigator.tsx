import React from 'react';
import {t} from '@lingui/macro';
import {useRef} from 'react';
import {useColorScheme} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import {useReduxDevToolsExtension} from '@react-navigation/devtools';
import {Default, DefaultDark} from 'lib/themes';
import {Home} from 'ui/stacks/Home';

const Stack = createStackNavigator();

export function Navigator() {
  const scheme = useColorScheme();
  const navRef = useRef<NavigationContainerRef>(null);
  const navTheme = scheme === 'dark' ? DefaultDark.nav : Default.nav;
  useReduxDevToolsExtension(navRef);
  return (
    <NavigationContainer ref={navRef} theme={navTheme}>
      <Stack.Navigator>
        <Stack.Screen name={t`Home`} component={Home}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
