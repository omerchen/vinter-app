import React, { useEffect } from "react";
import {
  StyleSheet,
  Image,
  ScrollView,
  Text,
  Platform,
  Dimensions
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
  let fixture = fixtures[fixtureId];

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
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      style={styles.container}
    >
      {Dimensions.get("window").height > 500 && (
        <Image
          source={require("../assets/images/colorful-logo-200h.png")}
          style={CommonStyles.smallLogo}
        />
      )}

      <Text style={CommonStyles.title}>מחזור {fixture.number}</Text>
      <MainButton
        title="משחקים"
        style={styles.button}
        onPress={() => {
          props.navigation.navigate({
            routeName: "Matches",
            params: { fixtureId: fixtureId }
          });
        }}
      />
      <MainButton
        title="סטטיסטיקה"
        style={{ ...styles.button }}
        onPress={() => {
          props.navigation.navigate("FixtureStatistics");
        }}
      />
    </ScrollView>
  );
};

ViewFixtureScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "מחזור " + navigationData.navigation.getParam("fixtureNumber"),
    headerRight: () => {
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
    backgroundColor: Colors.white
  },
  button: {
    marginTop: 30,
    marginBottom: 20
  }
});

export default ViewFixtureScreen;
