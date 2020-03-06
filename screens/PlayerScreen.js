import React from "react";
import { StyleSheet, View, Dimensions, Text } from "react-native";
import Colors from "../constants/colors";
import moment from "moment"
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import {MaterialCommunityIconsHeaderButton} from '../components/HeaderButton'

let PlayerSreen = props => {
  let player = props.navigation.getParam("player");
  return (
    <View style={styles.container}>
      <View style={styles.textView}>
        <Text style={styles.text}><Text style={styles.categoryText}>מספר שחקן:</Text> <Text style={styles.valueText}>{player.id}</Text></Text>
        <Text style={styles.text}><Text style={styles.categoryText}>סטטוס:</Text> <Text style={styles.valueText}>{player.type==0?"רגיל":"חייל"}</Text></Text>
        <Text style={styles.text}><Text style={styles.categoryText}>תאריך הוספה למערכת:</Text> <Text style={styles.valueText}>{moment(player.createTime).format("DD.MM.YYYY hh:mm:ss")}</Text></Text>
      </View>
    </View>
  );
};

PlayerSreen.navigationOptions = navigationData => {
  let player = navigationData.navigation.getParam("player")
  return {
    headerTitle: player.name,
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={MaterialCommunityIconsHeaderButton}>
          <Item
            title="Add Player"
            iconName="circle-edit-outline"
            onPress={() => {
              navigationData.navigation.navigate({ routeName: "EditPlayer", params: {"playerId": player.id} });
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

  },
  text: {
    fontSize:20
  },
  categoryText: {
    fontFamily: "assistant-regular",
  },
  valueText: {
    fontFamily: "assistant-semi-bold",
  }
});

export default PlayerSreen;
