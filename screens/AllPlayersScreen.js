import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CommonStyles from '../constants/common-styles'
import Colors from '../constants/colors'


let AllPlayersScreen = props => {
  let notPlayersExistsView = <Text style={styles.nonPlayersTitle}>לא קיימים שחקנים כרגע במערכת</Text>
  let playersListView = null
  return (
    <View style={styles.container}>
      {props.navigation.getParam("players").length > 0?playersListView:notPlayersExistsView}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nonPlayersTitle: {
    fontSize: 20,
    fontFamily: 'assistant-semi-bold',
    color: Colors.darkGray
  }
});

export default AllPlayersScreen