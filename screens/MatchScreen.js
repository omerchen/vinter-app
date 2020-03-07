import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {useSelector} from "react-redux"

let MatchScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId")
  const matchId = props.navigation.getParam("matchId")
  const fixtures = useSelector(state=>state.fixtures)
  let fixture = fixtures[fixtureId]

  return (
    <View style={styles.container}>
      <Text>This is the MatchScreen screen! ({fixture.number+","+matchId})</Text>
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

export default MatchScreen