import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions
} from "react-native";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";
import { useSelector } from "react-redux";
import PlayerCard from "../components/PlayerCard";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import TextInput from "react-native-material-textinput";

let AllPlayersScreen = props => {
  let [search, setSearch] = useState("");
  let players = useSelector(state => state.players);
  let filteredPlayers = players
    ? players
        .filter(item => !item.isRemoved)
        .filter(item => item.name.indexOf(search.trim()) != -1)
    : [];
  let notPlayersExistsView = (
    <View style={{justifyContent:"center", flex:1}}><Text style={styles.nonPlayersTitle}>לא נמצאו שחקנים במערכת</Text></View>
  );
  let playersListView = (
    <FlatList
      style={{ width: "100%" }}
      contentContainerStyle={{ alignItems: "center" }}
      data={filteredPlayers}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <PlayerCard playerId={item.id} navigation={props.navigation} />
      )}
    />
  );
  return (
    <DismissKeyboardView style={styles.container}>
      <TextInput
        label="חיפוש"
        value={search}
        onChangeText={text => setSearch(text)}
        fontFamily="assistant-semi-bold"
        marginBottom={-1}
        width={Dimensions.get("window").width - 30}
        activeColor={Colors.primary}
      />
      {filteredPlayers.length > 0 ? playersListView : notPlayersExistsView}
    </DismissKeyboardView>
  );
};

AllPlayersScreen.navigationOptions = navigationData => {
  return {
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
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
  },
  nonPlayersTitle: {
    fontSize: 20,
    fontFamily: "assistant-semi-bold",
    color: Colors.darkGray,
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
