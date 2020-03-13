import React from "react";
import { StyleSheet, View, Dimensions, Text, Platform } from "react-native";
import Colors from "../constants/colors";
import moment from "moment";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import { useSelector } from "react-redux";
import sleep from '../helpers/sleep'
import {SECURE_LEVEL_ADMIN} from '../constants/security-levels'

let PlayerSreen = props => {
  let players = useSelector(state => state.players);
  let playerId = props.navigation.getParam("playerId");

  if (!players[playerId] || players[playerId].isRemoved) {
    sleep(0).then(
      ()=>{
        props.navigation.pop();
      }
    )
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{players[playerId].name}</Text>
      <View style={styles.textView}>
        <Text style={styles.text}>
          <Text style={styles.categoryText}>מספר שחקן:</Text>{" "}
          <Text style={styles.valueText}>{players[playerId].id}</Text>
        </Text>
        <Text style={styles.text}>
          <Text style={styles.categoryText}>סטטוס:</Text>{" "}
          <Text style={styles.valueText}>
            {players[playerId].type == 0 ? "רגיל" : "חייל"}
          </Text>
        </Text>
        <Text style={styles.text}>
          <Text style={styles.categoryText}>תאריך הוספה למערכת:</Text>{" "}
          <Text style={styles.valueText}>
            {moment(players[playerId].createTime).format("DD.MM.YYYY HH:mm:ss")}
          </Text>
        </Text>
      </View>
    </View>
  );
};

PlayerSreen.navigationOptions = navigationData => {
  return {
    headerTitle: "פרטי שחקן",
    headerRight: () => {
      if (Platform.OS == "web") return null

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
                  params: {playerId: navigationData.navigation.getParam("playerId")},
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
    alignItems: "center",
    paddingTop: 40
  },
  textView: {
    alignItems: "flex-start"
  },
  text: {
    fontSize: 20
  },
  categoryText: {
    fontFamily: "assistant-regular"
  },
  valueText: {
    fontFamily: "assistant-semi-bold"
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 30
  }
});

export default PlayerSreen;
