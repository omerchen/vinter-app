import React from 'react';
import { StyleSheet, Text, View } from 'react-native';


let PreviousFixturesScreen = props => {
  return (
    <View style={styles.container}>
      <Text>This is the PreviousFixturesScreen screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'orange',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PreviousFixturesScreen