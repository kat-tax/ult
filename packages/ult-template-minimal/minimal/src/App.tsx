import {StyleSheet, View, Text} from 'react-native';

export function App() {
  return (
    <View style={styles.root}>
      <Text style={styles.greeting}>
        Hello, World!
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: 20,
  },
});
