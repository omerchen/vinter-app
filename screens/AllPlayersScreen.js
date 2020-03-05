import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";

let AllPlayersScreen = props => {
  let notPlayersExistsView = (
    <Text style={styles.nonPlayersTitle}>לא קיימים שחקנים כרגע במערכת</Text>
  );
  let playersListView = null;
  return (
    <View style={styles.container}>
      {props.navigation.getParam("players").length > 0
        ? playersListView
        : notPlayersExistsView}
    </View>
  );
};

AllPlayersScreen.navigationOptions = navigationData => {
  console.log(navigationData);
  return {
    headerRight: ()=>{
      return <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Add Player"
          iconName="ios-add"
          onPress={() => {
            console.log("Clicked! :)");
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
