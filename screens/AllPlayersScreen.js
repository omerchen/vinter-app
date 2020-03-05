import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import {useSelector} from 'react-redux'

let AllPlayersScreen = props => {
  let players = useSelector(state=>state.players)
  let notPlayersExistsView = (
    <Text style={styles.nonPlayersTitle}>לא קיימים שחקנים כרגע במערכת</Text>
  );
let playersListView = <Text style={{width:'70%',textAlign:'center'}}>{JSON.stringify(players)}</Text>;
  return (
    <View style={styles.container}>
      {players.length > 0
        ? playersListView
        : notPlayersExistsView}
    </View>
  );
};

AllPlayersScreen.navigationOptions = navigationData => {
  return {
    headerRight: ()=>{
      return <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add Player"
          iconName="ios-add"
          onPress={() => {
            navigationData.navigation.navigate({routeName:"AddPlayer"})
          }}
        />
      </HeaderButtons>
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  nonPlayersTitle: {
    fontSize: 20,
    fontFamily: "assistant-semi-bold",
    color: Colors.darkGray
  }
});

export default AllPlayersScreen;
