import React, {StyleSheet, Text, useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {t} from '@lingui/macro';

export function Home() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const classes = {
    greeting: [
      styles.greeting,
      isDark && styles.greetingDark,
    ],
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={classes.greeting}>
        {t`Hello World`}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    margin: 16,
  },
  greeting: {
    fontSize: 14,
    color: '#000',
  },
  greetingDark: {
    color: '#fff',
  },
});
