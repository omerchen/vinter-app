import React from "react";
import { HeaderButton } from "react-navigation-header-buttons";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import Colors from "../constants/colors";

export const IoniconsHeaderButton = props => {
  return <HeaderButton {...props} IconComponent={Ionicons} iconSize={35} color={Colors.white}/>;
};

export const MaterialCommunityIconsHeaderButton = props => {
  return <HeaderButton {...props} IconComponent={MaterialCommunityIcons} iconSize={35} color={Colors.white}/>;
};