import React, { useState } from "react";
import { StyleSheet, KeyboardAvoidingView } from "react-native";
import Colors from "../constants/colors";
import MainButton from "../components/MainButton";
import TextInput from "react-native-material-textinput";
import {DismissKeyboardView} from '../components/DismissKeyboardView'
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';


let AddPlayerScreen = props => {
  const [name, setName] = useState("");
  const [playerType, setPlayerType] = useState(0)

  let radio_props = [
    {label: 'Standard', value: 'standard' },
    {label: 'Soldier', value: 'soldier' }
  ];

  return (
    <KeyboardAvoidingView style={{flex:1}} behavior="padding" keyboardVerticalOffset={100}>
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
            <RadioForm
            radio_props={radio_props}
            initial={0}
            onPress={(value) => {setPlayerType(value)}}
            style={styles.radio}
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
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center"
  },
  radio: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: 200,
      marginLeft: -20,
      marginBottom: 20,
  }
});

export default AddPlayerScreen;
