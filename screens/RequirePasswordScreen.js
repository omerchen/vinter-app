import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  KeyboardAvoidingView,
  Alert
} from "react-native";
import Colors from "../constants/colors";
import { DismissKeyboardView } from "../components/DismissKeyboardView";
import TextInput from "react-native-material-textinput";
import SubButton from "../components/SubButton";
import { min } from "moment";
import { PASSWORDS, SECURE_LEVEL_LABELS, SECURE_MODE } from "../constants/security-levels";

let RequirePasswordScreen = props => {
  const keyboardOffset = Dimensions.get("window").height > 500 ? 100 : 20;
  const [password, setPassword] = useState("");
  const securityLevel = props.navigation.getParam("level");
  const routeName = props.navigation.getParam("routeName");
  const params = props.navigation.getParam("params");

  let navigate = () => {
    props.navigation.replace({ routeName: routeName, params: params });
  };

  if (!SECURE_MODE || securityLevel >= PASSWORDS.length) {
    navigate();
  }

  let logIn = () => {
    for (let i = 0; i <= securityLevel; i++) {
      if (PASSWORDS[i] === password) {
        navigate();
        return;
      }
    }
    setPassword("")
    Alert.alert("סיסמה שגויה", "אם אינך זוכר את הסיסמה פנה למנהל הקבוצה", null, {cancelable:true});
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <DismissKeyboardView style={styles.container}>
        <Text style={styles.title}>עליך להכניס סיסמה לפני המעבר לדף הבא</Text>
        <Text style={styles.securityNote}>
          רמת הרשאות מינימלית: {SECURE_LEVEL_LABELS[securityLevel]}
        </Text>
        <TextInput
          label="סיסמה"
          value={password}
          onChangeText={text => setPassword(text)}
          fontFamily="assistant-semi-bold"
          marginBottom={30}
          marginTop={20}
          width={200}
          activeColor={Colors.primary}
          secureTextEntry={true}
          fontSize={25}
        />
        <SubButton offline={password === ""} title="הבא" onPress={logIn} />
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
  title: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25
  },
  securityNote: {
    fontFamily: "assistant-semi-bold",
    fontSize: 18,
    color: Colors.darkGray
  }
});

export default RequirePasswordScreen;
