import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Dimensions,
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows } from "react-native-table-component";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { shortTeamLabelsArray } from "../helpers/fixture-list-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";
import { calculatePoints, RULES_EXTRA_POINT } from "../helpers/rules";
import { FIXTURE_TYPE_FRIENDLY } from "../constants/fixture-properties";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import { IoniconsHeaderButton } from "../components/HeaderButton";
import { mergeSort } from "../helpers/mergeSort";
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

let PlayerStatisticsScreen = props => {
  const fixtures = useSelector(state => state.fixtures);
  const players = useSelector(state => state.players);
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];




    const chartConfig = {
      backgroundGradientFrom: "#1E2923",
      backgroundGradientFromOpacity: 0,
      backgroundGradientTo: "#08130D",
      backgroundGradientToOpacity: 0.5,
      color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
      strokeWidth: 2, // optional, default 3
      barPercentage: 0.5
    };




    const data = {
      labels: ["Swim", "Bike", "Run"], // optional
      data: [0.4, 0.6, 0.8]
    };

    const screenWidth = Dimensions.get("window").width;






  return (
    <View
      style={styles.container}
    ><Text>hello world</Text>
    <ProgressChart
  data={data}
  width={screenWidth}
  height={220}
  chartConfig={chartConfig}
  hideLegend={false}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    backgroundColor: Colors.white
  },
  text: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 30
  }
});

PlayerStatisticsScreen.navigationOptions = navigationData => {
  return {
    headerTitle: navigationData.navigation.getParam("playerName")
      ? navigationData.navigation.getParam("playerName")
      : "סטטיסטיקות אישיות"
    // headerRight: () => {
    //   return (
    //     <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
    //       <Item
    //         title="Learn More"
    //         iconName="md-help"
    //         onPress={() => navigationData.navigation.navigate("Rules")}
    //       />
    //     </HeaderButtons>
    //   );
    // }
  };
};

export default PlayerStatisticsScreen;
