import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import Colors from "../constants/colors";
import DBCommunicator from "../helpers/db-communictor";
import { useSelector, useDispatch } from "react-redux";
import { setPlayers } from "../store/actions/players";
import { setFixtures } from "../store/actions/fixtures";

let FirstScreen = props => {
  // const [players, setPlayers] = useState(null);
  const fixtures = useSelector(state => state.fixturs)
  const dispatch = useDispatch();
  const [dataLoaded, setDataLoaded] = useState(false);

  let fetchData = onFinish => {
    DBCommunicator.getPlayers().then(res => {
      if (res.data) {
        dispatch(setPlayers(res.data));
      } else {
        dispatch(setPlayers([]));
      }

      DBCommunicator.getFixtures().then(res => {
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
    fetchData(() => {
      setDataLoaded(true);
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/colorful-logo-280h.png")}
        style={styles.logo}
      />
      <MainButton
        title="למחזור הנוכחי"
        offline={!dataLoaded}
        onPress={() => {
          props.navigation.navigate({
            routeName: "ViewFixture",
            params: {
              fixtureNumber: 25
            }
          });
        }}
      />
      <View style={{ alignItems: "center" }}>
        <SubButton
          title="למחזורים הקודמים"
          offline={!dataLoaded}
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
