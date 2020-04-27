import React from 'react';
import {Styles, View, Text} from 'react-ult';

export function AppFrame() {
  return (
    <View style={styles.root}>
      <Text selectable style={styles.welcome}>
        Hello World!
      </Text>
    </View>
  );
}

export const styles = {
  root: Styles.createViewStyle({
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  welcome: Styles.createTextStyle({
    textAlign: 'center',
  }),
};
