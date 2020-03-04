import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


let CreateFixtureScreen = props => {
  return (
    <View style={styles.container}>
      <Text>This is the CreateFixtureScreen screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CreateFixtureScreen