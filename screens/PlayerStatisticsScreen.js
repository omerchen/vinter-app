import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Image,
  Dimensions
} from "react-native";
import Colors from "../constants/colors";
import { useSelector } from "react-redux";
import { Table, Row, Rows, Col } from "react-native-table-component";
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
  const playerId = props.navigation.getParam("playerId")
  const filteredFixtures = fixtures
    ? fixtures.filter(
        fixture => !fixture.isRemoved && fixture.type != FIXTURE_TYPE_FRIENDLY
      )
    : [];

  const [goals, setGoals] = useState(0);
  const [assists, setAssists] = useState(0);
  const [saves, setSaves] = useState(0);

  const loadData = () => {
    let goalsCounter = 0
    let assistsCounter = 0
    let savesCounter = 0

    for (let i in fixtures) {
      let currentScore = calculatePoints(players, fixtures, playerId, i)

      goalsCounter += currentScore.goals
      assistsCounter += currentScore.assists
      savesCounter += currentScore.saves
    }

    setGoals(goalsCounter)
    setAssists(assistsCounter)
    setSaves(savesCounter)
  }

  useEffect(()=>{
    loadData()
  },[])

  // charts configuration

  const chartConfig = {
    backgroundGradientFrom: Colors.white,
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: Colors.white,
    backgroundGradientToOpacity: 1,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    color: (opacity = 1) => {
      return `black`;
    },
    barPercentage: 0.9
  };

  let data = [
    {
      name: "שערים",
      population: goals,
      color: Platform.OS=="web"?'#ea728c':'#413c69',
      legendFontColor: Colors.black,
      legendFontSize: 17
    },
    {
      name: "בישולים",
      population: assists,
      color: Platform.OS=="web"?'#fc9d9d':'#4a47a3',
      legendFontColor: Colors.black,
      legendFontSize: 17
    },
    {
      name: "הצלות",
      population: saves,
      color: Platform.OS=="web"?'#f3d4d4':'#ad62aa',
      legendFontColor: Colors.black,
      legendFontSize: 17,
    }
  ];

  if (Platform.OS == "android") {
    data = data.map(d => {
      let nd = { ...d };
      nd.name = nd.name
        .split("")
        .reverse()
        .join("");
      return nd;
    });
  }

  const screenWidth = Math.min(Dimensions.get("window").width*.85, 500);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      {(goals>0||assists>0||saves>0)&&<View style={styles.card}>
        <Text style={styles.title}>מאזן אישי</Text>
        <PieChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={chartConfig}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          style={{
            alignSelf: "center",
          }}
          absolute
        />
      </View>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: Colors.gray
  },
  card: {
    backgroundColor: Colors.white,
    justifyContent:"flex-start",
    alignItems:"center",
    elevation:5,
    margin:5,
    borderRadius:10,
    padding:10,
    maxWidth: '92%'
  }, 
  text: {
    fontFamily: "assistant-semi-bold",
    fontSize: 25,
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 25,
    marginBottom:10
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
