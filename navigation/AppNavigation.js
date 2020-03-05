import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import FirstScreen from "../screens/FirstScreen";
import CreateFixtureScreen from "../screens/CreateFixtureScreen";
import PreviousFixturesScreen from "../screens/PreviousFixturesScreen";
import ViewFixtureScreen from "../screens/ViewFixtureScreen";
import AllPlayersScreen from "../screens/AllPlayersScreen"

import Colors from "../constants/colors";

const MainNavigator = createStackNavigator(
  {
    First: {
      screen: FirstScreen,
      navigationOptions: {
        headerTitle: ""
      }
    },
    CreateFixture: {
      screen: CreateFixtureScreen,
      navigationOptions: {
        headerTitle: "מחזור חדש"
      }
    },
    PreviousFixtures: {
      screen: PreviousFixturesScreen,
      navigationOptions: {
        headerTitle: "מחזורים קודמים"
      }
    },
    ViewFixture: {
      screen: ViewFixtureScreen,
    },
    AllPlayers: {
      screen: AllPlayersScreen,
      navigationOptions: {
        headerTitle: "שחקני הקבוצה"
      }
    }
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Colors.primary
      },
      headerTintColor: Colors.white,
      headerTitleStyle: {
        fontFamily: "assistant-semi-bold"
      },
      headerTitleAlign: 'center'
    }
  }
);

export default createAppContainer(MainNavigator);
