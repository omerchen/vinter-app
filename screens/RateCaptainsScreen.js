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
import { SET_FIXTURES } from "../store/actions/fixtures";
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

let RateCaptainsScreen = props => {
  const reviewsLevels = ["גרוע", "בינוני", "אחלה", "מצויין", "מושלם"];
  const keyboardOffset = Dimensions.get("window").height>500?100:20

  let [loading, setLoading] = useState(false);
  const fixtureId = props.navigation.getParam("fixtureId");
  let fixture = props.fixtures[fixtureId];

  if (fixture.isRemoved) {
    sleep(0).then(() => {
      props.navigation.pop();
    });
  }

  // states blue
  const blueCaptainObject = fixture.playersList[0].players[0];
  const blueCaptainName = props.players[blueCaptainObject.id].name;
  const [blueRating, setBlueRating] = useState(
    blueCaptainObject.captainRating != undefined
      ? blueCaptainObject.captainRating
      : null
  );
  const [blueDescription, setBlueDesctiption] = useState(
    blueCaptainObject.captainDescription != null &&
      blueCaptainObject.captainDescription != undefined
      ? blueCaptainObject.captainDescription
      : ""
  );

  // states orange
  const orangeCaptainObject = fixture.playersList[1].players[0];
  const orangeCaptainName = props.players[orangeCaptainObject.id].name;
  const [orangeRating, setOrangeRating] = useState(
    orangeCaptainObject.captainRating != undefined
      ? orangeCaptainObject.captainRating
      : null
  );
  const [orangeDescription, setOrangeDesctiption] = useState(
    orangeCaptainObject.captainDescription != null &&
      orangeCaptainObject.captainDescription != undefined
      ? orangeCaptainObject.captainDescription
      : ""
  );

  // states green
  const greenCaptainObject = fixture.playersList[2].players[0];
  const greenCaptainName = props.players[greenCaptainObject.id].name;
  const [greenRating, setGreenRating] = useState(
    greenCaptainObject.captainRating != undefined
      ? greenCaptainObject.captainRating
      : null
  );
  const [greenDescription, setGreenDesctiption] = useState(
    greenCaptainObject.captainDescription != null &&
      greenCaptainObject.captainDescription != undefined
      ? greenCaptainObject.captainDescription
      : ""
  );

  let updateCaptainsRating = useCallback(() => {
    let newFixture = {...fixture}

    newFixture.playersList[0].players[0].captainRating = blueRating
    newFixture.playersList[0].players[0].captainDescription = blueDescription
    
    newFixture.playersList[1].players[0].captainRating = orangeRating
    newFixture.playersList[1].players[0].captainDescription = orangeDescription

    newFixture.playersList[2].players[0].captainRating = greenRating
    newFixture.playersList[2].players[0].captainDescription = greenDescription

    updateFixtures(newFixture)

  }, [props.fixtures, props.setFixtures, fixtureId, loading, setLoading, blueRating, blueDescription, orangeRating, orangeDescription, greenRating, greenDescription]);

  useEffect(() => {
    props.navigation.setParams({
      save: updateCaptainsRating
    });
  }, [updateCaptainsRating]);

  let updateFixtures = newFixture => {
    setLoading(true);
    let newFixtures = [...props.fixtures];
    newFixtures[fixtureId] = newFixture;

    DBCommunicator.setFixtures(newFixtures).then(res => {
      if (res.status === 200) {
        props.setFixtures(newFixtures);
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
          <Text style={styles.title}>{blueCaptainName}</Text>
          <AirbnbRating
            reviews={reviewsLevels}
            defaultRating={blueRating}
            onFinishRating={rating => setBlueRating(rating)}
            selectedColor={Colors.teamBlue.primary}
            reviewColor={Colors.gray}
          />
          <TextInput
            label="הערות"
            value={blueDescription}
            onChangeText={text => setBlueDesctiption(text)}
            fontFamily="assistant-semi-bold"
            width={200}
            activeColor={Colors.primary}
            fontSize={20}
            alignText="center"
            labelColor={Colors.darkGray}
            underlineColor={Colors.darkGray}
          />
          <SubButton
            style={styles.resetButton}
            title="איפוס"
            onPress={() => {
              setBlueRating(null);
              setBlueDesctiption("");
            }}
          />
        </View>


        <View style={styles.cardView}>
          <Text style={styles.title}>{orangeCaptainName}</Text>
          <AirbnbRating
            reviews={reviewsLevels}
            defaultRating={orangeRating}
            onFinishRating={rating => setOrangeRating(rating)}
            selectedColor={Colors.teamOrange.primary}
            reviewColor={Colors.gray}
          />
          <TextInput
            label="הערות"
            value={orangeDescription}
            onChangeText={text => setOrangeDesctiption(text)}
            fontFamily="assistant-semi-bold"
            width={200}
            activeColor={Colors.primary}
            fontSize={20}
            alignText="center"
            labelColor={Colors.darkGray}
            underlineColor={Colors.darkGray}
          />
          <SubButton
            style={styles.resetButton}
            title="איפוס"
            onPress={() => {
              setOrangeRating(null);
              setOrangeDesctiption("");
            }}
          />
        </View>


        <View style={styles.cardView}>
          <Text style={styles.title}>{greenCaptainName}</Text>
          <AirbnbRating
            reviews={reviewsLevels}
            defaultRating={greenRating}
            onFinishRating={rating => setGreenRating(rating)}
            selectedColor={Colors.teamGreen.primary}
            reviewColor={Colors.gray}
          />
          <TextInput
            label="הערות"
            value={greenDescription}
            onChangeText={text => setGreenDesctiption(text)}
            fontFamily="assistant-semi-bold"
            width={200}
            activeColor={Colors.primary}
            fontSize={20}
            alignText="center"
            labelColor={Colors.darkGray}
            underlineColor={Colors.darkGray}
          />
          <SubButton
            style={styles.resetButton}
            title="איפוס"
            onPress={() => {
              setGreenRating(null);
              setGreenDesctiption("");
            }}
          />
        </View>
        <View style={{height:20}}/>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

RateCaptainsScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "דרג קפטנים",
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
    marginBottom: 20
  },
  resetButton: {
    marginTop: 20
  }
});

const mapStateToProps = state => ({
  fixtures: state.fixtures,
  players: state.players
});

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(mapStateToProps, mapDispatchToProps)(RateCaptainsScreen);
