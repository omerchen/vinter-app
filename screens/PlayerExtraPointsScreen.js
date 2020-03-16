import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  Dimensions,
  Platform
} from "react-native";
import Colors from "../constants/colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";
import { useSelector } from "react-redux";
import ExtraPointCard from "../components/ExtraPointCard";
import TextInput from "react-native-material-textinput";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import { SECURE_LEVEL_ADMIN } from "../constants/security-levels";
import {mergeSort} from "../helpers/mergeSort"

let PlayerExtraPointsScreen = props => {
  let players = useSelector(state => state.players);
  const playerId = props.navigation.getParam("playerId");
  let player = players[playerId];
  let extraPoints = player.extraPoints
    ? player.extraPoints.filter(t => !t.isRemoved)
    : [];

  let notExtraPointsExistsView = (
    <View style={{ justifyContent: "center", flex: 1, width: "100%" }}>
      <Text style={styles.nonPlayersTitle}>לא נמצא ניקוד נלווה במערכת</Text>
    </View>
  );

  const sortByDateString = (a, b) => {
    let aArr = a.date.split(".").reverse();
    let bArr = b.date.split(".").reverse();

    for (let i in aArr) {
      if (aArr[i] > bArr[i]) return true;
      else if (bArr[i] > aArr[i]) return false;
    }

    return true
  };

  let numOfColumn = 1;
  let windowWidth = Dimensions.get("window").width;
  if (windowWidth > 500) numOfColumn = 2;
  if (windowWidth > 1000) numOfColumn = 3;
  let extraPointsListView = (
    <FlatList
      style={{ width: "100%" }}
      contentContainerStyle={{ alignItems: "center" }}
      data={Platform.OS=="web"?mergeSort(extraPoints, sortByDateString):extraPoints.sort(sortByDateString)}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <ExtraPointCard
          playerId={playerId}
          extraPointId={item.id}
          navigation={props.navigation}
        />
      )}
      numColumns={numOfColumn}
    />
  );

  let playerExtraPointsSum = 0;
  for (let i in extraPoints) {
    playerExtraPointsSum += extraPoints[i].sum;
  }

  playerExtraPointsSum = playerExtraPointsSum.toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.totalView}>
        <Text style={styles.totalSubtitle}>מאזן כללי</Text>
        <Text style={styles.totalTitle}>{playerExtraPointsSum}</Text>
      </View>
      {extraPoints.length > 0
        ? extraPointsListView
        : notExtraPointsExistsView}
    </View>
  );
};

PlayerExtraPointsScreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("playerName")
    ? navigationData.navigation.getParam("playerName")
    : "ניקוד נלווה",
    headerRight: () => {
      if (Platform.OS == "web") return null;

      return (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Add Extra Point"
            iconName="ios-add"
            onPress={() => {
              navigationData.navigation.navigate({
                routeName: "RequirePassword",
                params: {
                  routeName: "AddExtraPoint",
                  params: {
                    playerId: navigationData.navigation.getParam("playerId")
                  },
                  level: SECURE_LEVEL_ADMIN
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
    textAlign: "center"
  },
  totalTitle: {
    fontFamily: "assistant-bold",
    fontSize: 45
  },
  totalSubtitle: {
    marginTop: 10,
    fontFamily: "assistant-semi-bold",
    fontSize: 20,
    color: Colors.black,
    marginBottom: -10
  },
  totalView: {
    alignItems: "center"
  }
});

export default PlayerExtraPointsScreen;
