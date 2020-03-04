import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";
import MainButton from '../components/MainButton'
import SubButton from '../components/SubButton'

let FirstScreen = props => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/colorful-logo-280h.png")} style={styles.logo}/>
      <Text style={styles.title}>אפליקציית ליגת וינטר</Text>
      <MainButton
        title="Create Fixture"
        onPress={() => {
          props.navigation.navigate("CreateFixture");
        }}
      />
      <SubButton
        title="למחזורים הקודמים"
        onPress={() => {
          props.navigation.navigate("PreviousFixtures");
          console.log(props);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center"
  },
  logo: {
      height: 140,
      resizeMode: 'contain',
  },
  title: {
    fontFamily: 'assistant-bold'
  }
});

export default FirstScreen;
