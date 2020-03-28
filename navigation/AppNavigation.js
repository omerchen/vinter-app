import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import FirstScreen from "../screens/FirstScreen";
import CreateFixtureScreen from "../screens/CreateFixtureScreen";
import PreviousFixturesScreen from "../screens/PreviousFixturesScreen";
import FixtureStatisticsScreen from "../screens/FixtureStatisticsScreen";
import MatchesScreen from "../screens/MatchesScreen";
import WebMatchScreen from "../screens/WebMatchScreen";
import ViewFixtureScreen from "../screens/ViewFixtureScreen";
import AllPlayersScreen from "../screens/AllPlayersScreen"
import RequirePasswordScreen from "../screens/RequirePasswordScreen"
import MatchScreen from "../screens/MatchScreen"
import PreviousMatchesScreen from "../screens/PreviousMatchesScreen"
import CreateEventScreen from "../screens/CreateEventScreen"
import ManageFixtureScreen from "../screens/ManageFixtureScreen"
import RulesScreen from "../screens/RulesScreen"
import CreateMatchScreen from "../screens/CreateMatchScreen"
import AddTransactionScreen from "../screens/AddTransactionScreen"
import PlayerScreen from "../screens/PlayerScreen"
import LeagueTableScreen from "../screens/LeagueTableScreen"
import AddPlayerScreen from "../screens/AddPlayerScreen"
import PlayerTransactionsScreen from "../screens/PlayerTransactionsScreen"
import EditPlayerScreen from "../screens/EditPlayerScreen"

import Colors from "../constants/colors";
import EditFixtureScreen from "../screens/EditFixtureScreen";
import EditTransactionScreen from "../screens/EditTransactionScreen";
import ManageLeagueScreen from "../screens/ManageLeagueScreen";
import TransactionsTableScreen from "../screens/TransactionsTableScreen";
import PlayerExtraPointsScreen from "../screens/PlayerExtraPointsScreen";
import AddExtraPointScreen from "../screens/AddExtraPointScreen";
import EditExtraPointScreen from "../screens/EditExtraPointScreen";
import RateCaptainsScreen from "../screens/RateCaptainsScreen";
import CaptainsTableScreen from "../screens/CaptainsTableScreen";
import RatePlayerScreen from "../screens/RatePlayerScreen";
import RatingTableScreen from "../screens/RatingTableScreen";
import GenerateTeamsScreen from "../screens/GenerateTeamsScreen";
import PlayerStatisticsScreen from "../screens/PlayerStatisticsScreen";
import LeagueRecordsScreen from "../screens/LeagueRecordsScreen";

const MainNavigator = createStackNavigator(
  {
    First: {
      screen: FirstScreen,
    },
    Match: {
      screen: MatchScreen,
    },
    WebMatch: {
      screen: WebMatchScreen,
    },
    CreateEvent: {
      screen: CreateEventScreen,
    },
    CreateFixture: {
      screen: CreateFixtureScreen,
      navigationOptions: {
        headerTitle: "מחזור חדש"
      }
    },
    GenerateTeams: {
      screen: GenerateTeamsScreen,
    },
    EditFixture: {
      screen: EditFixtureScreen,
    },
    RateCaptains: {
      screen: RateCaptainsScreen,
    },
    PlayerStatistics: {
      screen: PlayerStatisticsScreen,
    },
    RatePlayer: {
      screen: RatePlayerScreen,
    },
    PreviousFixtures: {
      screen: PreviousFixturesScreen,
    },
    LeagueRecords: {
      screen: LeagueRecordsScreen,
    },
    PreviousMatches: {
      screen: PreviousMatchesScreen,
      navigationOptions: {
        headerTitle: "משחקי המחזור"
      }
    },
    Rules: {
      screen: RulesScreen,
      navigationOptions: {
        headerTitle: "שיטת הניקוד"
      }
    },
    AddTransaction: {
      screen: AddTransactionScreen,
      navigationOptions: {
        headerTitle: "הוספת טרנזקציה"
      }
    },
    AddExtraPoint: {
      screen: AddExtraPointScreen,
      navigationOptions: {
        headerTitle: "הוספת ניקוד נלווה"
      }
    },
    ManageLeague: {
      screen: ManageLeagueScreen,
      navigationOptions: {
        headerTitle: "ניהול ליגה"
      }
    },
    TransactionsTable: {
      screen: TransactionsTableScreen,
      navigationOptions: {
        headerTitle: "טבלת כספים"
      }
    },
    CaptainsTable: {
      screen: CaptainsTableScreen,
      navigationOptions: {
        headerTitle: "טבלת קפטנים"
      }
    },
    RatingTable: {
      screen: RatingTableScreen,
      navigationOptions: {
        headerTitle: "טבלת כוחות"
      }
    },
    LeagueTable: {
      screen: LeagueTableScreen,
    },
    PlayerTransactions: {
      screen: PlayerTransactionsScreen,
    },
    PlayerExtraPoints: {
      screen: PlayerExtraPointsScreen,
    },
    FixtureStatistics: {
      screen: FixtureStatisticsScreen,
    },
    EditTransaction: {
      screen: EditTransactionScreen,
    },
    EditExtraPoint: {
      screen: EditExtraPointScreen,
    },
    CreateMatch: {
      screen: CreateMatchScreen,
      navigationOptions: {
        headerTitle: "יצירת משחק חדש"
      }
    },
    Matches: {
      screen: MatchesScreen,
      navigationOptions: {
        headerTitle: "משחקי המחזור"
      }
    },
    ManageFixture: {
      screen: ManageFixtureScreen,
      navigationOptions: {
        headerTitle: "ניהול מחזור"
      }
    },
    RequirePassword: {
      screen: RequirePasswordScreen,
      navigationOptions: {
        headerTitle: "בדיקת הרשאות"
      }
    },
    ViewFixture: {
      screen: ViewFixtureScreen,
    },
    AllPlayers: {
      screen: AllPlayersScreen,
    },
    AddPlayer: {
      screen: AddPlayerScreen,
      navigationOptions: {
        headerTitle: "הוספת שחקן"
      }
    },
    EditPlayer: {
      screen: EditPlayerScreen,
    },
    Player: {
      screen: PlayerScreen
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
