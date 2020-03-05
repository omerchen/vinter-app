import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import TextInput from "react-native-material-textinput";
import {DismissKeyboardView} from '../components/DismissKeyboardView'

let AddPlayerScreen = props => {
  const [name, setName] = useState("");

  return (
    <DismissKeyboardView style={styles.container}>
        {/* <Text>This is the AddPlayerScreen screen!</Text> */}
        <TextInput
          label="Full Name"
          value={name}
          onChangeText={text => setName(text)}
          fontFamily="assistant-semi-bold"
          marginBottom={30}
          width={200}
          activeColor={Colors.primary}
        />
        <MainButton
          width={250}
          title="שמור במערכת"
          offline={!name}
          onPress={() => {
            props.navigation.pop();
          }}
        />
    </DismissKeyboardView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  }
});

export default AddPlayerScreen;
