import React, {StyleSheet, Text, useColorScheme} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {t} from '@lingui/macro';

export function Home() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';
  const classes = {
    text: [
      styles.text,
      isDark && styles.textDark,
    ],
  };

  return (
    <SafeAreaView style={styles.root}>
      <Text style={classes.text}>
        {t`Hello World`}
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    margin: 16,
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
  textDark: {
    color: '#fff',
  },
});
