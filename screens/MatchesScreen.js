import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {useSelector} from "react-redux"

let MatchesScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId")
  const fixtures = useSelector(state=>state.fixtures)
  let fixture = fixtures[fixtureId]

  return (
    <View style={styles.container}>
      <Text>This is the MatchesScreen screen! ({fixture.number})</Text>
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

export default MatchesScreen