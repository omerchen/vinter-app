import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  Alert,
  View,
  Image,
  Text,
  Platform,
  ImageBackground
} from "react-native";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import Colors from "../constants/colors";
import DBCommunicator from "../helpers/db-communictor";
import { useSelector, useDispatch } from "react-redux";
import { setPlayers } from "../store/actions/players";
import { setFixtures } from "../store/actions/fixtures";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import {
  SECURE_LEVEL_FOUNDER,
  SECURE_LEVEL_ADMIN
} from "../constants/security-levels";
import Spinner from "react-native-loading-spinner-overlay";
import { version } from "../constants/configs";
import dbCommunictor from "../helpers/db-communictor";

let FirstScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  let currentFixture = null;

  for (let i in fixtures) {
    if (fixtures[i].isOpen && !fixtures[i].isRemoved) {
      currentFixture = fixtures[i];
      break;
    }
  }
  const dispatch = useDispatch();
  const [dataLoaded, setDataLoaded] = useState(false);

  let fetchData = onFinish => {
    DBCommunicator.getPlayers().then(res => {
      if (res.status !== 200) {
        Alert.alert("Connection error (" + res.status + "");
        return;
      }

      if (res.data) {
        dispatch(setPlayers(res.data));
      } else {
        dispatch(setPlayers([]));
      }

      DBCommunicator.getFixtures().then(res => {
        if (res.status !== 200) {
          Alert.alert("Connection error (" + res.status + "");
          return;
        }

        if (res.data) {
          dispatch(setFixtures(res.data));
        } else {
          dispatch(setFixtures([]));
        }

        if (onFinish) onFinish();
      });
    });
  };

  useEffect(() => {
    if (!dataLoaded) {
      fetchData(() => {
        setDataLoaded(true);
      });
    }
  }, [dataLoaded]);

  let refresh = useCallback(() => {
    setDataLoaded(false);
  }, [setDataLoaded]);

  useEffect(() => {
    props.navigation.setParams({
      refresh: refresh
    });
  }, [setDataLoaded]);

  const [webVisits, setWebVisits] = useState([]);

  if (Platform.OS == "web") {
    useEffect(() => {
      dbCommunictor.getVisits().then(res => {
        let newWebVisits = [...webVisits];

        if (res.status == 200) {
          if (res.data != null && res.data != undefined) {
            newWebVisits = [...res.data];
          }

          newWebVisits.push({ time: Date.now() });

          dbCommunictor.setVisits(newWebVisits).then(res => {
            if (res.status == 200) {
              setWebVisits(newWebVisits);
            } else {
              console.log("put request failed: " + res.status);
            }
          });
        } else {
          console.log("get requets failed: " + res.status);
        }
      });
    }, []);
  }

  return (
    <View style={{ flex: 1, height: "100%", backgroundColor: Colors.white }}>
      <View style={styles.container}>
        <Spinner visible={!dataLoaded} textContent={""} textStyle={{}} />
        {Platform.OS != "web" ? (
          <Image
            source={require("../assets/images/colorful-logo-280h.png")}
            style={styles.logo}
          />
        ) : (
          <ImageBackground
            resizeMode="contain"
            source={require("../assets/images/colorful-logo-280h.png")}
            style={{ height: 200, width: 200 }}
          />
        )}
        {currentFixture ? (
          <MainButton
            title="למחזור הנוכחי"
            offline={!dataLoaded}
            onPress={() => {
              props.navigation.navigate({
                routeName: "ViewFixture",
                params: {
                  fixtureId: currentFixture.id
                }
              });
            }}
          />
        ) : Platform.OS == "web" ? (
          <Text style={styles.noFixtureTitle}>לא משוחק מחזור כרגע</Text>
        ) : (
          <MainButton
            title="מחזור חדש"
            offline={!dataLoaded}
            onPress={() => {
              props.navigation.navigate({
                routeName: "RequirePassword",
                params: {
                  routeName: "CreateFixture",
                  level: SECURE_LEVEL_ADMIN
                }
              });
            }}
          />
        )}

        <View style={{ alignItems: "center" }}>
          <SubButton
            title="טבלת הליגה"
            offline={!dataLoaded}
            onPress={() => {
              props.navigation.navigate("LeagueTable");
            }}
            style={styles.subButton}
          />
          <SubButton
            title="היכל התהילה"
            offline={!dataLoaded}
            onPress={() => {
              props.navigation.navigate("LeagueRecords");
            }}
            style={styles.subButton}
          />
          <SubButton
            title="למחזורים הקודמים"
            offline={
              !dataLoaded ||
              !fixtures ||
              !(
                fixtures.filter(item => !item.isRemoved && !item.isOpen)
                  .length > 0
              )
            }
            onPress={() => {
              props.navigation.navigate("PreviousFixtures");
            }}
            style={styles.subButton}
          />
          <SubButton
            title="שחקני הקבוצה"
            offline={!dataLoaded}
            onPress={() => {
              props.navigation.navigate({
                routeName: "AllPlayers"
              });
            }}
            style={styles.subButton}
          />
          {Platform.OS != "web" && (
            <SubButton
              style={styles.subButton}
              title="ניהול ליגה"
              offline={!dataLoaded}
              onPress={() => {
                props.navigation.navigate({
                  routeName: "RequirePassword",
                  params: {
                    level: SECURE_LEVEL_ADMIN,
                    routeName: "ManageLeague"
                  }
                });
              }}
            />
          )}
        </View>
      </View>
      <View style={{flexDirection:"row", justifyContent:"center"}}>
        {(Platform.OS == "web" && webVisits.length > 0) && (
          <Text style={styles.visitsText}>{"צפיות: " + webVisits.length}</Text>
        )}
        <Text style={styles.versionText}>{"מספר גרסא: " + version}</Text>
      </View>
    </View>
  );
};

FirstScreen.navigationOptions = navigationData => {
  let refresh = navigationData.navigation.getParam("refresh");

  return {
    headerTitle: "",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item title="Add Player" iconName="refresh" onPress={refresh} />
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
    justifyContent: "space-evenly"
  },
  logo: {
    height: 140,
    resizeMode: "contain"
  },
  versionText: {
    color: Colors.darkGray,
    textAlign: "center",
    paddingBottom: 20,
    fontFamily: "assistant-regular"
  },
  visitsText: {
    color: Colors.darkGray,
    textAlign: "center",
    paddingBottom: 20,
    fontFamily: "assistant-regular",
    marginEnd:20,
  },
  noFixtureTitle: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
    color: Colors.darkGray
  },
  subButton: {
    marginBottom: 15
  }
});

export default FirstScreen;
