import React, { useState, useEffect } from "react";
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
import TextInput from "react-native-material-textinput";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import { SECURE_LEVEL_ADMIN } from "../constants/security-levels";

let AllPlayersScreen = props => {
  let [search, setSearch] = useState("");
  let players = useSelector(state => state.players);

  let activePlayers = players ? players.filter(item => !item.isRemoved) : [];

  let filteredPlayers = activePlayers
    .filter(item => item.name.indexOf(search.trim()) != -1)
    .sort(function(a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });

  useEffect(() => {
    props.navigation.setParams({
      initialName: search,
      amountOfPlayers: activePlayers.length
    });
  }, [search, players]);

  let notPlayersExistsView = (
    <DismissKeyboardView
      style={{ justifyContent: "center", flex: 1, width:"100%"}}
    >
      <Text style={styles.nonPlayersTitle}>לא נמצאו שחקנים במערכת</Text>
    </DismissKeyboardView>
  );

  let numOfColumn = 1;
  let windowWidth = Dimensions.get("window").width;
  if (windowWidth > 500) numOfColumn = 2;
  if (windowWidth > 1000) numOfColumn = 3;
  let playersListView = (
    <FlatList
      style={{ width: "100%" }}
      contentContainerStyle={{ alignItems: "center" }}
      data={filteredPlayers}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <PlayerCard playerId={item.id} navigation={props.navigation} />
      )}
      numColumns={numOfColumn}
    />
  );

  return (
    <View style={styles.container}>
      <TextInput
        label="חיפוש"
        value={search}
        onChangeText={text => setSearch(text)}
        fontFamily="assistant-semi-bold"
        marginBottom={-1}
        width={Dimensions.get("window").width - 30}
        activeColor={Colors.primary}
        onFocus={() => {
          setSearch("");
        }}
      />
      {filteredPlayers.length > 0 ? playersListView : notPlayersExistsView}
    </View>
  );
};

AllPlayersScreen.navigationOptions = navigationData => {
  return {
    headerTitle:
      "שחקני הקבוצה (" +
      navigationData.navigation.getParam("amountOfPlayers") +
      ")",
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Add Player"
            iconName="ios-add"
            onPress={() => {
              navigationData.navigation.navigate({
                routeName: "RequirePassword",
                params: {
                  routeName: "AddPlayer",
                  params: {initialName: navigationData.navigation.getParam("initialName"),},
                  level: SECURE_LEVEL_ADMIN,
                }
              });
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
    alignItems: "center"
  },
  nonPlayersTitle: {
    fontSize: 20,
    fontFamily: "assistant-semi-bold",
    color: Colors.darkGray,
    textAlign:"center"
  }
});

export default AllPlayersScreen;
