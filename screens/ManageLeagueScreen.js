import React, { useEffect } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";

let ManageLeagueScreen = props => {
  return (
    <View style={styles.container}>
      <MainButton title="טבלת כספים" onPress={()=>{
        props.navigation.navigate("TransactionsTable")
      }}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems:"center",
    justifyContent:"center"
  },
  button: {
    marginBottom: 70
  },
  metaDataText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 20
  },
  metaDataView: {
    marginBottom: 70,
    alignItems: "center"
  },
  text: {
    fontFamily: "assistant-semi-bold",
    fontSize: 22
  },
  textBold: {
    fontFamily: "assistant-bold",
    fontSize: 22,
    marginStart: 5
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 30,
    marginBottom: 5,
    marginTop: 25
  },
  lineView: {
    flexDirection: "row",
    width: 350
  }
});

export default ManageLeagueScreen;
