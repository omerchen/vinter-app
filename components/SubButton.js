import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import Colors from "../constants/colors"


let SubButton = props => {
    return (
    <TouchableOpacity onPress={props.onPress}>
        <Text style={styles.title}>{props.title}</Text>
    </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    title: {
        color: Colors.primary,
        textDecorationLine: 'underline',
        fontFamily: 'assistant-semi-bold',
        fontSize: 20
    }
})

export default SubButton