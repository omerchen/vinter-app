import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { useSelector, connect } from "react-redux";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import SubButton from "../components/SubButton";
import dbCommunictor from "../helpers/db-communictor";
import {SET_FIXTURES} from "../store/actions/fixtures"

let CreateMatchScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const vestArray = [
    require("../assets/images/blue_vest-500h.png"),
    require("../assets/images/orange_vest-500h.png"),
    require("../assets/images/green_vest-500h.png")
  ];
  let fixture = props.fixtures[fixtureId];
  let matches = fixture.matches ? fixture.matches : [];
  let endMatches = matches.filter(item => !item.isRemoved && !item.isOpen);

  let lastMatch =
    endMatches.length > 0 ? endMatches[endMatches.length - 1] : null;

  let initialHomeId = lastMatch && lastMatch.winnerId ? lastMatch.winnerId : 0;
  let initialOutsideId =
    lastMatch && lastMatch.winnerId
      ? lastMatch.homeId + lastMatch.awayId - lastMatch.winnerId
      : 2;

  const [homeTeamId, setHomeTeamId] = useState(initialHomeId);
  const [awayTeamId, setAwayTeamId] = useState(
    3 - initialHomeId - initialOutsideId
  );
  const [outsideTeamId, setOutsideTeamId] = useState(initialOutsideId);

  const switchHome = () => {
    let tmp = outsideTeamId
    setOutsideTeamId(homeTeamId)
    setHomeTeamId(tmp)
  }
  const switchAway = () => {
    let tmp = outsideTeamId
    setOutsideTeamId(awayTeamId)
    setAwayTeamId(tmp)
  }

  const createMatch = () => {
    let newMatch = {
      id: matches.length,
      homeId: homeTeamId,
      awayId: awayTeamId,
      createTime: Date.now(),
      isRemoved: false,
      isOpen: true,
    }

    let newFixtures = [...props.fixtures]

    if (newFixtures[fixtureId].matches)
    {
      newFixtures[fixtureId].matches.push(newMatch)
    }
    else
    {
      newFixtures[fixtureId].matches = [newMatch]
    }

    dbCommunictor.setFixtures(newFixtures).then((res)=>{
      if (res.status===200) {
        props.setFixtures(newFixtures)
        props.navigation.replace({routeName:"Match", params:{
          fixtureId: fixtureId,
          matchId: newMatch.id
        }})
      } else {
        Alert.alert("תהליך יצירת המשחק נכשל", "ודא שהינך מחובר לרשת ונסה שנית", null, {cancelable:true});
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.teamsView}>
    <TouchableWithoutFeedback onPress={switchHome}>
          <View style={styles.teamView}>
            <Image source={vestArray[homeTeamId]} style={styles.vestImage} />
            <SubButton textStyle={styles.changeBtn} title="החלף" onPress={switchHome} />
          </View>
          </TouchableWithoutFeedback>
        <View style={styles.vsView}>
          <Text style={styles.vsText}>נגד</Text>
        </View>
    <TouchableWithoutFeedback onPress={switchAway}>
          <View style={styles.teamView}>
            <Image source={vestArray[awayTeamId]} style={styles.vestImage} />
            <SubButton textStyle={styles.changeBtn} title="החלף" onPress={switchAway} />
          </View>
          </TouchableWithoutFeedback>
      </View>
      <MainButton title="התחל משחק!" onPress={createMatch} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  teamsView: {
    height: "80%",
    width: "70%",
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row"
  },
  teamView: {
    alignItems: "center"
  },
  teamText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25
  },
  vsView: {
    alignItems: "center"
  },
  vsText: {
    fontFamily: "assistant-bold",
    fontSize: 30,
    color: Colors.black
  },
  changeBtn: {
    fontSize: 30,
    fontFamily: "assistant-bold"
  },
  vestImage: {}
});

const mapStateToProps = state => ({ fixtures: state.fixtures })

const mapDispatchToProps = {
  setFixtures: (fixtures) => ({ type: SET_FIXTURES, newFixtures: fixtures})
};


export default connect(mapStateToProps, mapDispatchToProps)(CreateMatchScreen);
