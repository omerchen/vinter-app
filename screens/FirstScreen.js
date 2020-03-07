import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, Alert, View, Image } from "react-native";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import Colors from "../constants/colors";
import DBCommunicator from "../helpers/db-communictor";
import { useSelector, useDispatch, connect } from "react-redux";
import {SET_FIXTURES} from '../store/actions/fixtures'
import {SET_PLAYERS} from '../store/actions/players'
import { setPlayers } from "../store/actions/players";
import { setFixtures } from "../store/actions/fixtures";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";

let FirstScreen = props => {
  // const [players, setPlayers] = useState(null);
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
    if (!dataLoaded)
    {
      fetchData(() => {
        setDataLoaded(true);
      });
    }
  }, [dataLoaded]);

  let refresh = useCallback(()=>{
    setDataLoaded(false)
  },[setDataLoaded])

  useEffect(()=>{
    props.navigation.setParams({
      refresh: refresh
    })
  },[setDataLoaded])

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/colorful-logo-280h.png")}
        style={styles.logo}
      />
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
      ) : (
        <MainButton
          title="מחזור חדש"
          offline={!dataLoaded}
          onPress={() => {
            props.navigation.navigate({
              routeName: "CreateFixture"
            });
          }}
        />
      )}

      <View style={{ alignItems: "center" }}>
        <SubButton
          title="למחזורים הקודמים"
          offline={
            !dataLoaded ||
            !fixtures ||
            !(
              fixtures.filter(item => !item.isRemoved && !item.isOpen).length >
              0
            )
          }
          onPress={() => {
            props.navigation.navigate("PreviousFixtures");
          }}
        />
        <SubButton
          title="שחקני הקבוצה"
          style={{ marginTop: 20 }}
          offline={!dataLoaded}
          onPress={() => {
            props.navigation.navigate({
              routeName: "AllPlayers"
            });
          }}
        />
      </View>
    </View>
  );
};

FirstScreen.navigationOptions = navigationData => {
  let refresh = navigationData.navigation.getParam("refresh")

  return {
    headerTitle: "",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Add Player"
            iconName="refresh"
            onPress={refresh}
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
    justifyContent: "space-evenly"
  },
  logo: {
    height: 140,
    resizeMode: "contain"
  }
});

export default FirstScreen;
