import React from "react";
import { Text, StyleSheet, View, Platform } from "react-native";
import Colors from "../constants/colors";
import Sizes from "../constants/sizes";
import SubButton from "./SubButton";
import FeedbackTouchable from "./PlatformTouchable";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

let MainButton = props => {
  if (Platform.OS == "ios") {
    return (
      <SubButton style={{ fontFamily: "assistant-extra-bold" }} {...props} />
    );
  }

  return (
    <View
      style={{
        ...styles.wrapper,
        ...props.style,
        width: props.width ? props.width : 420,
        backgroundColor: props.offline ? Colors.darkGray : Colors.primary
      }}
    >
      <FeedbackTouchable
        disabled={props.offline}
        style={styles.touchableView}
        onPress={props.onPress}
      >
        <View style={styles.view}>
          {props.icon &&
            (props.iconLib == "material" ? (
              <MaterialCommunityIcons
                name={props.icon}
                size={30}
                color={Colors.white}
                style={{ marginEnd: 15 }}
              />
            ) : (
              <Ionicons
                name={props.icon}
                size={30}
                color={Colors.white}
                style={{ marginEnd: 15 }}
              />
            ))}
          <Text style={styles.title}>{props.title}</Text>
        </View>
      </FeedbackTouchable>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row"
  },
  touchableView: {
    flex: 1
  },
  wrapper: {
    borderRadius: 5,
    overflow: "hidden"
  },
  title: {
    color: Colors.white,
    fontFamily: "assistant-semi-bold",
    fontSize: Sizes.normal
  }
});

export default MainButton;
