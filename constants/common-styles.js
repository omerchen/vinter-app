import { StyleSheet } from "react-native";
import Colors from './colors'

export default StyleSheet.create({
  smallLogo: {
    height: 100,
    resizeMode: "contain",
    marginVertical: 30,
  },
  title: {
    fontSize: 70,
    fontFamily: 'assistant-semi-bold',
    color: Colors.black
  },
});
