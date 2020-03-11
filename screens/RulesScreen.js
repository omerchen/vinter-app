import React, { useEffect } from "react";
import { StyleSheet, ScrollView, Text, View } from "react-native";
import Colors from "../constants/colors";
import {
  RULES_GOAL,
  RULES_ASSIST,
  RULES_SAVE,
  RULES_YELLOW,
  RULES_SECOND_YELLOW,
  RULES_RED,
  RULES_PUNISH,
  RULES_FAIRPLAY,
  RULES_MVP,
  RULES_CLEANSHEET,
  RULES_CLEANSHEET_GK,
  RULES_FIXTURE_TIE,
  RULES_FIXTURE_WIN_CAPTAIN,
  RULES_FIXTURE_TIE_CAPTAIN,
  RULES_FIXTURE_WIN,
  RULES_MATCH_WIN_PENALTIES,
  RULES_MATCH_WIN,
  RULES_MATCH_NO_GOALS_TIE_CAPTAIN,
  RULES_MATCH_NO_GOALS_TIE_FINAL_CAPTAIN,
  RULES_MATCH_WIN_PENALTIES_FINAL_CAPTAIN,
  RULES_CLEANSHEET_FINAL,
  RULES_CLEANSHEET_GK_FINAL,
  RULES_FIXTURE_WIN_FINAL_CAPTAIN,
  RULES_MATCH_LOSE_PENALTIES,
  RULES_MATCH_LOSE_PENALTIES_CAPTAIN,
  RULES_MATCH_TIE,
  RULES_MATCH_TIE_CAPTAIN,
  RULES_MATCH_TIE_FINAL,
  RULES_MATCH_WIN_CAPTAIN,
  RULES_MATCH_WIN_PENALTIES_CAPTAIN,
  RULES_MVP_FINAL,
  RULES_ASSIST_FINAL,
  RULES_FIXTURE_TIE_FINAL,
  RULES_FIXTURE_TIE_FINAL_CAPTAIN,
  RULES_FIXTURE_WIN_FINAL,
  RULES_GOAL_FINAL,
  RULES_MATCH_LOSE_PENALTIES_FINAL,
  RULES_MATCH_LOSE_PENALTIES_FINAL_CAPTAIN,
  RULES_MATCH_NO_GOALS_TIE,
  RULES_MATCH_NO_GOALS_TIE_FINAL,
  RULES_MATCH_TIE_FINAL_CAPTAIN,
  RULES_MATCH_WIN_FINAL,
  RULES_MATCH_WIN_FINAL_CAPTAIN,
  RULES_MATCH_WIN_PENALTIES_FINAL,
  RULES_RED_FINAL,
  RULES_SAVE_FINAL,
  RULES_SECOND_YELLOW_FINAL,
  RULES_YELLOW_FINAL,
} from "../helpers/rules";
import { EVENT_TYPE_SECOND_YELLOW } from "../constants/event-types";

let Rules = props => {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <Text style={styles.title}>מחזור רגיל</Text>
      <View style={styles.lineView}>
        <Text style={styles.text}>גול:</Text>
        <Text style={styles.textBold}>{RULES_GOAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>בישול:</Text>
        <Text style={styles.textBold}>{RULES_ASSIST}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>הצלה:</Text>
        <Text style={styles.textBold}>{RULES_SAVE}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>שער נקי (שחקן):</Text>
        <Text style={styles.textBold}>{RULES_CLEANSHEET}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>שער נקי (שוער):</Text>
        <Text style={styles.textBold}>{RULES_CLEANSHEET_GK}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>כרטיס צהוב:</Text>
        <Text style={styles.textBold}>{RULES_YELLOW}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>צהוב שני:</Text>
        <Text style={styles.textBold}>{RULES_SECOND_YELLOW}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>כרטיס אדום:</Text>
        <Text style={styles.textBold}>{RULES_RED}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>שחקן מצטיין:</Text>
        <Text style={styles.textBold}>{RULES_MVP}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>שחקן הוגן:</Text>
        <Text style={styles.textBold}>{RULES_FAIRPLAY}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ענישת ועדה:</Text>
        <Text style={styles.textBold}>{RULES_PUNISH}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במחזור:</Text>
        <Text style={styles.textBold}>{RULES_FIXTURE_WIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו במחזור:</Text>
        <Text style={styles.textBold}>{RULES_FIXTURE_TIE}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במחזור (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_FIXTURE_WIN_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו במחזור (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_FIXTURE_TIE_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במשחקון:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_WIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במשחקון בפנדלים:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_WIN_PENALTIES}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>הפסד במשחקון בפנדלים:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_LOSE_PENALTIES}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו במשחקון:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_TIE}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו ללא שערים במשחקון:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_NO_GOALS_TIE}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במשחקון (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_WIN_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במשחקון בפנדלים (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_WIN_PENALTIES_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>הפסד במשחקון בפנדלים (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_LOSE_PENALTIES_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו במשחקון (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_TIE_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו ללא שערים במשחקון (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_NO_GOALS_TIE_CAPTAIN}</Text>
      </View>

      <View style={{ height: 50 }} />

      <Text style={styles.title}>מחזור גמר</Text>
      <View style={styles.lineView}>
        <Text style={styles.text}>גול:</Text>
        <Text style={styles.textBold}>{RULES_GOAL_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>בישול:</Text>
        <Text style={styles.textBold}>{RULES_ASSIST_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>הצלה:</Text>
        <Text style={styles.textBold}>{RULES_SAVE_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>שער נקי (שחקן):</Text>
        <Text style={styles.textBold}>{RULES_CLEANSHEET_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>שער נקי (שוער):</Text>
        <Text style={styles.textBold}>{RULES_CLEANSHEET_GK_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>כרטיס צהוב:</Text>
        <Text style={styles.textBold}>{RULES_YELLOW_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>צהוב שני:</Text>
        <Text style={styles.textBold}>{RULES_SECOND_YELLOW_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>כרטיס אדום:</Text>
        <Text style={styles.textBold}>{RULES_RED_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>שחקן מצטיין:</Text>
        <Text style={styles.textBold}>{RULES_MVP_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במחזור:</Text>
        <Text style={styles.textBold}>{RULES_FIXTURE_WIN_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו במחזור:</Text>
        <Text style={styles.textBold}>{RULES_FIXTURE_TIE_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במחזור (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_FIXTURE_WIN_FINAL_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו במחזור (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_FIXTURE_TIE_FINAL_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במשחקון:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_WIN_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במשחקון בפנדלים:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_WIN_PENALTIES_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>הפסד במשחקון בפנדלים:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_LOSE_PENALTIES_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו במשחקון:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_TIE_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו ללא שערים במשחקון:</Text>
        <Text style={styles.textBold}>{RULES_MATCH_NO_GOALS_TIE_FINAL}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במשחקון (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_WIN_FINAL_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>ניצחון במשחקון בפנדלים (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_WIN_PENALTIES_FINAL_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>הפסד במשחקון בפנדלים (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_LOSE_PENALTIES_FINAL_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו במשחקון (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_TIE_FINAL_CAPTAIN}</Text>
      </View>
      <View style={styles.lineView}>
        <Text style={styles.text}>תיקו ללא שערים במשחקון (קפטן):</Text>
        <Text style={styles.textBold}>{RULES_MATCH_NO_GOALS_TIE_FINAL_CAPTAIN}</Text>
      </View>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  button: {
    marginBottom: 70
  },
  metaDataText: {
    fontFamily: "assistant-semi-bold",
    fontSize: 20
  },
  metaDataView: {
    marginBottom: 70,
    alignItems: "center"
  },
  text: {
    fontFamily: "assistant-semi-bold",
    fontSize: 22
  },
  textBold: {
    fontFamily: "assistant-bold",
    fontSize: 22,
    marginStart: 5
  },
  title: {
    fontFamily: "assistant-bold",
    fontSize: 30,
    marginBottom: 5,
    marginTop: 25
  },
  lineView: {
    flexDirection: "row",
    width: 400
  }
});

export default Rules;
