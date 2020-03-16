import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";
import { connect } from "react-redux";
import Colors from "../constants/colors";
import DBCommunicator from "../helpers/db-communictor";
import MainButton from "../components/MainButton";
import Spinner from "react-native-loading-spinner-overlay";
import sleep from "../helpers/sleep";
import { Rating, AirbnbRating } from "react-native-ratings";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import TextInput from "react-native-material-textinput";
import {
  MaterialCommunityIconsHeaderButton,
  IoniconsHeaderButton,
  MaterialIconsHeaderButton
} from "../components/HeaderButton";
import SubButton from "../components/SubButton";
import { SET_PLAYERS } from "../store/actions/players";

let RatePlayerScreen = props => {
  const reviewsAttackLevels = ["שחקן פחות","מחטיא מול שער ריק", "שישאר מאחורה","1-2 גולים למשחק", "עושה את העבודה", "לא מפספס", "אלוהים ישמור"];
  const reviewsDefenseLevels = ["שחקן פחות","חורים בהגנה","בקבוצה בשביל הגולים","יודע לעשות הגנה","בלם מנוסה","גרזן","מלדיני"];
  const reviewColors = [Colors.darkGray, Colors.primary, Colors.primary, Colors.primary, Colors.primary, Colors.primary,Colors.blue]
  const keyboardOffset = Dimensions.get("window").height>500?100:20

  let [loading, setLoading] = useState(false);
  const playerId = props.navigation.getParam("playerId");
  const player = props.players[playerId]

  // states
  const [attackRating, setAttackRating] = useState(
    player.attackRating != undefined?player.attackRating:null);

  const [defenseRating, setDefenseRating] = useState(
    player.defenseRating != undefined?player.defenseRating:null);

  let updateRating = useCallback(() => {
    let newPlayer = {...player}

    newPlayer.attackRating = attackRating
    newPlayer.defenseRating = defenseRating

    updatePlayers(newPlayer)

  }, [props.players, props.setPlayers, playerId, loading, setLoading, attackRating, defenseRating]);

  useEffect(() => {
    props.navigation.setParams({
      save: updateRating
    });
  }, [updateRating]);

  let updatePlayers = newPlayer => {
    setLoading(true);
    let newPlayers = [...props.players];
    newPlayers[playerId] = newPlayer;

    DBCommunicator.setPlayers(newPlayers).then(res => {
      if (res.status === 200) {
        props.setPlayers(newPlayers);
        props.navigation.pop();
      } else {
        setLoading(false);
        Alert.alert("הפעולה נכשלה", "ודא שהינך מחובר לרשת ונסה שנית", null, {
          cancelable: true
        });
      }
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={keyboardOffset}>
      <Spinner visible={loading} textContent={""} textStyle={{}} />
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={{ alignItems: "center" }}
      >
        <View style={styles.cardView}>
          <Text style={styles.title}>התקפה</Text>
          <AirbnbRating
            reviews={reviewsAttackLevels}
            defaultRating={attackRating}
            onFinishRating={rating => setAttackRating(rating)}
            selectedColor={reviewColors[attackRating-1]}
            reviewColor={Colors.gray}
            count={reviewsAttackLevels.length}
          />
          <SubButton
            style={styles.resetButton}
            title="איפוס"
            onPress={() => {
              setAttackRating(null);
            }}
          />
        </View>


        <View style={styles.cardView}>
          <Text style={styles.title}>הגנה</Text>
          <AirbnbRating
            reviews={reviewsDefenseLevels}
            defaultRating={defenseRating}
            onFinishRating={rating => setDefenseRating(rating)}
            selectedColor={reviewColors[defenseRating-1]}
            reviewColor={Colors.gray}
            count={reviewsDefenseLevels.length}
          />
          <SubButton
            style={styles.resetButton}
            title="איפוס"
            onPress={() => {
              setDefenseRating(null);
            }}
          />
        </View>

        <View style={{height:20}}/>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

RatePlayerScreen.navigationOptions = navigationData => {
  let playerName = navigationData.navigation.getParam("playerName")
  return {
    headerTitle: playerName?playerName:"דרג שחקן",
    headerRight: () => {
      return (
        <HeaderButtons HeaderButtonComponent={MaterialIconsHeaderButton}>
          <Item
            title="Remove Fixture"
            iconName="done"
            onPress={navigationData.navigation.getParam("save")}
          />
        </HeaderButtons>
      );
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.brightGray
  },
  cardView: {
    backgroundColor: Colors.white,
    padding: 25,
    maxWidth: 500,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    margin: 20,
    marginBottom: 5
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 30,
  },
  resetButton: {
    marginTop: 20
  }
});

const mapStateToProps = state => ({
  players: state.players
});

const mapDispatchToProps = {
  setPlayers: players => ({ type: SET_PLAYERS, newPlayers: players })
};

export default connect(mapStateToProps, mapDispatchToProps)(RatePlayerScreen);
