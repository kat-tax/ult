import {StyleSheet, View, Text} from 'react-native';

export function Home() {
  return (
    <View style={styles.root}>
      <Text>Hello World</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
