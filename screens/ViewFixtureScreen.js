import React, { useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  Text,
  Platform,
  Dimensions,
  View
} from "react-native";
import MainButton from "../components/MainButton";
import Colors from "../constants/colors";
import CommonStyles from "../constants/common-styles";
import { useSelector } from "react-redux";
import sleep from "../helpers/sleep";
import SubButton from "../components/SubButton";
import {
  SECURE_LEVEL_ADMIN,
  SECURE_LEVEL_BOARD,
  SECURE_LEVEL_CLUB,
  SECURE_LEVEL_NO_PASSWORD,
  SECURE_LEVEL_FOUNDER
} from "../constants/security-levels";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";

let ViewFixtureScreen = props => {
  let fixtureId = props.navigation.getParam("fixtureId");
  let fixtures = useSelector(state => state.fixtures);
  let players = useSelector(state => state.players);
  let fixture = fixtures[fixtureId];

  let fixtureTypesLabel = ["מחזור רגיל", "מחזרו גמר", "מחזור ידידות"];
  let fixtureCourtLabel = ["מגרש 1", "מגרש 2", "מגרש 3"];

  useEffect(() => {
    props.navigation.setParams({
      fixtureNumber: fixture.number
    });
  }, [fixture.number]);

  if (!fixture || fixture.isRemoved) {
    sleep(0).then(() => {
      props.navigation.pop();
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.metaDataView}>
        <Text style={styles.metaDataText}>
          {fixtureTypesLabel[fixture.type]} | {fixture.date} |{" "}
          {fixture.startTime} | {fixtureCourtLabel[fixture.court]}
        </Text>
          {(fixture.mvpId!=undefined&&fixture.mvpId!=null)&&<Text style={styles.metaDataText}>
            השחקן המצטיין: {players[fixture.mvpId].name}
            </Text>}
      </View>
      {Platform.OS!="web"&&<MainButton
        title="משחקים"
        icon="ios-football"
        style={styles.button}
        onPress={() => {
          props.navigation.navigate({
            routeName: "Matches",
            params: { fixtureId: fixtureId }
          });
        }}
      />}
      <MainButton
        title="סטטיסטיקה"
        icon="ios-stats"
        style={{ ...styles.button }}
        onPress={() => {
          props.navigation.navigate({routeName:"FixtureStatistics", params:{fixtureId: fixtureId}});
        }}
      />
    </View>
  );
};

ViewFixtureScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "מחזור " + navigationData.navigation.getParam("fixtureNumber"),
    headerRight: () => {
      if (Platform.OS == "web") return null

      return (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="Add Player"
            iconName="ios-settings"
            onPress={() => {
              navigationData.navigation.navigate({
                routeName: "RequirePassword",
                params: {
                  params: {
                    fixtureId: navigationData.navigation.getParam("fixtureId")
                  },
                  routeName: "ManageFixture",
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
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    marginBottom: 70
  },
  metaDataText: {
    fontFamily:"assistant-semi-bold",
    fontSize:20,
  },
  metaDataView: {
    marginBottom:70,
    alignItems:"center"
  }
});

export default ViewFixtureScreen;
