import React from "react";
import { StyleSheet, View, Dimensions, Text, Platform } from "react-native";
import Colors from "../constants/colors";
import moment from "moment";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import { useSelector } from "react-redux";
import sleep from "../helpers/sleep";
import { SECURE_LEVEL_ADMIN } from "../constants/security-levels";
import { ScrollView } from "react-native-gesture-handler";
import SubButton from "../components/SubButton";

let PlayerSreen = props => {
  let players = useSelector(state => state.players);
  let playerId = props.navigation.getParam("playerId");
  let playerTransactions = players[playerId].transactions
    ? players[playerId].transactions.filter(t => !t.isRemoved)
    : [];
  let playerTransactionsSum = 0;
  for (let i in playerTransactions) {
    playerTransactionsSum += playerTransactions[i].sum;
  }

  playerTransactionsSum = playerTransactionsSum.toFixed(1)

  if (!players[playerId] || players[playerId].isRemoved) {
    sleep(0).then(() => {
      props.navigation.pop();
    });
  }

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      style={styles.container}
    >
      <Text style={styles.title}>{players[playerId].name}</Text>
      <View style={styles.textView}>
        <View style={styles.textLineView}>
          <Text style={styles.categoryText}>מזהה שחקן: </Text>
          <Text style={styles.valueText}>{players[playerId].id}</Text>
        </View>
        <View style={styles.textLineView}>
          <Text style={styles.categoryText}>סטטוס: </Text>
          <Text style={styles.valueText}>
            {players[playerId].type == 0 ? "רגיל" : "חייל"}
          </Text>
        </View>
        <View style={styles.textLineView}>
          <Text style={styles.categoryText}>מאזן כספי: </Text>
          <Text
            style={
              playerTransactionsSum == 0
                ? styles.valueText
                : playerTransactionsSum > 0
                ? styles.greenValueText
                : styles.redValueText
            }
          >
            {playerTransactionsSum + "₪"}
          </Text>
        </View>
        <View style={styles.textLineView}>
          <Text style={styles.categoryText}>תאריך הוספה למערכת: </Text>
          <Text style={styles.valueText}>
            {moment(players[playerId].createTime).format("DD.MM.YYYY")}
          </Text>
        </View>
      </View>
      <View style={{ marginTop: 15, alignItems: "center" }}>
      <SubButton
          style={styles.featureButton}
          title="מאזן כספי"
          onPress={() => {
            props.navigation.navigate({
              routeName: "PlayerTransactions",
              params: { playerId: playerId, playerName: players[playerId].name }
            });
          }}
        />
        <SubButton
          style={styles.featureButton}
          title="סטטיסטיקות אישיות"
          onPress={() => {
            props.navigation.navigate({
              routeName: "PlayerStatistics",
              params: { playerId: playerId, playerName: players[playerId].name }
            });
          }}
        />
        <SubButton
          style={styles.featureButton}
          title="צפייה במחזורים"
          onPress={() => {
            props.navigation.navigate({
              routeName: "PreviousFixtures",
              params: { playerId: playerId, playerName: players[playerId].name }
            });
          }}
        />
        <SubButton
          style={styles.featureButton}
          title="ניקוד נלווה"
          onPress={() => {
            props.navigation.navigate({
              routeName: "PlayerExtraPoints",
              params: { playerId: playerId, playerName: players[playerId].name }
            });
          }}
        />
        
      </View>
    </ScrollView>
  );
};

PlayerSreen.navigationOptions = navigationData => {
  return {
    headerTitle: "פרטי שחקן",
    headerRight: () => {
      if (Platform.OS == "web") return null;

      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Edit Player"
            iconName="circle-edit-outline"
            onPress={() => {
              navigationData.navigation.navigate({
                routeName: "RequirePassword",
                params: {
                  routeName: "EditPlayer",
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
    paddingTop: 40
  },
  textView: {
    alignItems: "flex-start"
  },
  textLineView: {
    flexDirection: "row"
  },
  categoryText: {
    fontSize: 20,
    fontFamily: "assistant-regular"
  },
  valueText: {
    fontSize: 20,
    fontFamily: "assistant-semi-bold"
  },
  redValueText: {
    fontSize: 20,
    fontFamily: "assistant-bold",
    color: "red"
  },
  greenValueText: {
    fontSize: 20,
    fontFamily: "assistant-semi-bold",
    color: "green"
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 30,
    marginBottom: 20
  },
  featureButton: {
    marginTop: 15
  }
});

export default PlayerSreen;
