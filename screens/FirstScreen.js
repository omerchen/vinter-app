import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import Colors from "../constants/colors";
import DBCommunicator from "../helpers/db-communictor";
import Sleep from "../helpers/sleep";
import {useSelector} from 'react-redux'

let FirstScreen = props => {
  const [players, setPlayers] = useState(null);
  const [fixturs, setFixtures] = useState(null);
  // const players = useSelector(state=>state.players)
  const [dataLoaded, setDataLoaded] = useState(false);

  let fetchData = onFinish => {
    DBCommunicator.getPlayers().then(res => {
      if (res.data) {
        setPlayers(res.data);
      } else {
        setPlayers([]);
      }

      DBCommunicator.getFixtures().then(res => {
        if (res.data) {
          setFixtures(res.data);
        } else {
          setFixtures([]);
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
              routeName: "AllPlayers",
              params: {
                players: players,
                setPlayers: (updatedPlayers, callback)=>{
                  DBCommunicator.setPlayers(updatedPlayers).then((res)=>{
                    if ((res.status===200))
                    {
                      setPlayers(updatedPlayers)
                      callback(true)
                    }
                    else callback(false)
                  })
                }
              }
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
