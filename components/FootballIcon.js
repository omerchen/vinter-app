import React from "react"
import {StyleSheet, View, Image} from "react-native"

export const footballIconTypes = {
    goal: require("../assets/images/footballIcons/goal.png"),
    yellow: require("../assets/images/footballIcons/yellow.png"),
    red: require("../assets/images/footballIcons/red.png"),
    second_yellow: require("../assets/images/footballIcons/second_yellow.png"),
    wall: require("../assets/images/footballIcons/wall.png"),
}

export let FootballIcon = props => {
    return <View style={{...styles.container,...props.style}}><Image resizeMode="contain" style={styles.image} source={props.source}/></View>
}

const styles = StyleSheet.create({
    container: {
        height: 30,
        aspectRatio: 1,
        alignItems:"center"
    },
    image: {
        height:30,
    }
})
