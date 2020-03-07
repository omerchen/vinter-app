import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors"
import Sizes from "../constants/sizes";


let SubButton = props => {
    return (
    <TouchableOpacity disabled={props.offline} onPress={props.onPress} style={props.style}>
        <Text style={{...styles.title, ...props.textStyle, color: props.offline?Colors.darkGray:Colors.primary}}>{props.title}</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    title: {
        textDecorationLine: 'underline',
        fontFamily: 'assistant-semi-bold',
        fontSize: Sizes.normal
    }
})

export default SubButton