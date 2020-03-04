import React from "react";
import { StyleSheet, Text, View, Button, Image } from "react-native";

let FirstScreen = props => {
  return (
    <View style={styles.container}>
      <Image source={require("../assets/images/colorful-logo-280h.png")} style={styles.logo}/>
      <Text style={styles.title}>אפליקציית ליגת וינטר</Text>
      <Button
        title="Create Fixture"
        onPress={() => {
          props.navigation.navigate("CreateFixture");
        }}
      />
      <Button
        title="Previous Fixtures"
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
