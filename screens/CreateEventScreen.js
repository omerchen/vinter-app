import React, { useCallback, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Alert,
  TouchableOpacity,
  Image
} from "react-native";
import { connect } from "react-redux";
import Colors from "../constants/colors";
import RadioForm from "react-native-simple-radio-button";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { MaterialCommunityIconsHeaderButton } from "../components/HeaderButton";
import DBCommunicator from "../helpers/db-communictor";
import MainButton from "../components/MainButton"
import { SET_FIXTURES } from "../store/actions/fixtures";
import { Dropdown } from 'react-native-material-dropdown';


let CreateEventScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId");
  const isHome = props.navigation.getParam("isHome");
  const time = props.navigation.getParam("time");
  const matchId = props.navigation.getParam("matchId");
  let fixture = props.fixtures[fixtureId];
  let match = fixture.matches[matchId];

  const eventTypesRadio = [
    { label: "  גול", value: 0 },
    { label: "  הצלה גדולה", value: 1 },
    { label: "  כרטיס צהוב", value: 2 },
    { label: "  כרטיס אדום", value: 3 },
  ];

  let playersData = []

  for (let i in fixture.playersList) {
    playersData.push(...fixture.playersList[i].players)
  }

  return (
    <View style={styles.container}>
      <RadioForm
          radio_props={eventTypesRadio}
          initial={0}
          onPress={value => {
            // setPlayerType(value);
          }}
          animation={false}
          style={styles.radio}
          buttonColor={Colors.darkGray}
          selectedButtonColor={Colors.primary}

          />
      <View style={{width:450}}>
      <Dropdown
        label='כובש השער'
        data={playersData.sort((a,b)=>props.players[a.id].name>props.players[b.id].name)}
        onChangeText={(val, i)=>{
          console.log(playersData[i])
        }}
        labelFontSize={20}
        fontSize={25}
        itemCount={6}
        animationDuration={0}
        valueExtractor={item=>item.id}
        labelExtractor={item=>props.players[item.id].name}
      />
      <Dropdown
        label='מבשל השער'
        data={playersData.sort((a,b)=>props.players[a.id].name>props.players[b.id].name)}
        onChangeText={(val, i)=>{
          console.log(playersData[i])
        }}
        labelFontSize={20}
        fontSize={25}
        itemCount={6}
        animationDuration={0}
        valueExtractor={item=>item.id}
        containerStyle={{marginTop:25}}
        labelExtractor={item=>props.players[item.id].name}
      />
      <MainButton title="הוסף אירוע" style={{marginTop:20}} width={450}/>
      </View>
    </View>
  );
};

CreateEventScreen.navigationOptions = navigationData => {
  return {
    headerTitle: "הוספת אירוע חדש"
    // headerRight: () => {
    //   return (
    //     <HeaderButtons
    //       HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
    //     >
    //       <Item
    //         title="Add Player"
    //         iconName="delete"
    //         onPress={}
    //       />
    //     </HeaderButtons>
    //   );
    // }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  radio: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: 500,
    marginBottom: 25,
  }
});
const selectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize:40,
  }
});

const mapStateToProps = state => ({
  fixtures: state.fixtures,
  players: state.players
});

const mapDispatchToProps = {
  setFixtures: fixtures => ({ type: SET_FIXTURES, newFixtures: fixtures })
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateEventScreen);
