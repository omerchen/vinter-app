import React from "react"
import {Platform, TouchableHighlight, TouchableNativeFeedback, TouchableWithoutFeedback} from 'react-native'

let PlatformTouchableFeedback = props => {
    switch(Platform.OS) {
        case "android":
            return <TouchableNativeFeedback {...props}>{props.children}</TouchableNativeFeedback>
        case "ios":
            return <TouchableWithoutFeedback {...props}>{props.children}</TouchableWithoutFeedback>
        default:
            return <TouchableWithoutFeedback {...props}>{props.children}</TouchableWithoutFeedback>
    }
}

export default PlatformTouchableFeedback