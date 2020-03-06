import React from "react";
import { StyleSheet, Text, View, ScrollView, FlatList } from "react-native";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import HeaderButton from "../components/HeaderButton";
import { useSelector } from "react-redux";
import PlayerCard from '../components/PlayerCard'

let AllPlayersScreen = props => {
  let players = useSelector(state => state.players);
  let notPlayersExistsView = (
    <Text style={styles.nonPlayersTitle}>לא קיימים שחקנים כרגע במערכת</Text>
  );
  let playersListView = (
    <FlatList
      style={{ width: "100%"}}
      contentContainerStyle={{ alignItems: "center" }}
      data={players}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <PlayerCard player={item} navigation={props.navigation}/>}
    />
  );
  return (
    <View style={styles.container}>
      {players && players.length > 0 ? playersListView : notPlayersExistsView}
    </View>
  );
};

AllPlayersScreen.navigationOptions = navigationData => {
  return {
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={HeaderButton}>
          <Item
            title="Add Player"
            iconName="ios-add"
            onPress={() => {
              navigationData.navigation.navigate({ routeName: "AddPlayer" });
            }}
          />
        </HeaderButtons>
      );
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
  },
  playerView: {
    backgroundColor: Colors.primaryBright,
    borderRadius: 10,
    width: 300,
    height: 100,
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
    elevation: 10
  },
  playerTitle: {
    fontFamily: "assistant-bold",
    fontSize: 25,
    color: Colors.black
  },
  playerSubTitle: {
    fontFamily: "assistant-semi-bold",
    fontSize: 20,
    color: Colors.primary
  }
});

export default AllPlayersScreen;
