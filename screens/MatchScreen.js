import React, {useCallback, useEffect} from 'react';
import { StyleSheet, Text, View,Alert } from 'react-native';
import {connect} from "react-redux"
import Colors from "../constants/colors"
import {HeaderButtons, Item} from "react-navigation-header-buttons"
import {MaterialCommunityIconsHeaderButton} from "../components/HeaderButton"
import DBCommunicator from "../helpers/db-communictor"
import {SET_FIXTURES} from "../store/actions/fixtures"

let MatchScreen = props => {
  const fixtureId = props.navigation.getParam("fixtureId")
  const matchId = props.navigation.getParam("matchId")
  let fixture = props.fixtures[fixtureId]


  const deleteMatch = () => {
    let newFixtures = [...props.fixtures];

    newFixtures[fixtureId].matches[matchId].isRemoved = true
    newFixtures[fixtureId].matches[matchId].removeTime = Date.now()

    DBCommunicator.setFixtures(newFixtures).then(res => {
      if (res.status === 200) {
        props.setFixtures(newFixtures);
        props.navigation.pop();
      } else {
        Alert.alert("תהליך המחיקה נכשל", "ודא שהינך מחובר לרשת ונסה שנית", null, {cancelable:true});
      }
    });
  };

  const showDeleteDialog = useCallback(() => {
    Alert.alert("מחיקת משחק","האם אתה בטוח שברצונך למחוק את המשחק הנוכחי?",[
      {text: "לא", style: "cancel"},
      {text: "מחק", onPress: deleteMatch , style: "destructive"},
    ], {
      cancelable: true,
      
    })
  },[props.fixtures, props.setFixtures, fixtureId])

  useEffect(()=>{
    props.navigation.setParams({
      deleteMatch: showDeleteDialog
    })
  }, [showDeleteDialog])


  return (
    <View style={styles.container}>
      <Text>This is the MatchScreen screen! ({fixture.number+","+matchId})</Text>
    </View>
  );
}

MatchScreen.navigationOptions = navigationData => {
  let refresh = navigationData.navigation.getParam("refresh")

  return {
    headerTitle: "דף משחק",
    headerRight: () => {
      return (
        <HeaderButtons
          HeaderButtonComponent={MaterialCommunityIconsHeaderButton}
        >
          <Item
            title="Add Player"
            iconName="delete"
            onPress={navigationData.navigation.getParam("deleteMatch")}/>
        </HeaderButtons>
      );
    }
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = state => ({ fixtures: state.fixtures, players: state.players })

const mapDispatchToProps = {
  setFixtures: (fixtures) => ({ type: SET_FIXTURES, newFixtures: fixtures})
};

export default connect(mapStateToProps, mapDispatchToProps)(MatchScreen)