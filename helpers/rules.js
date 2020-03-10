import {
  FIXTURE_TYPE_STANDARD,
  FIXTURE_TYPE_FINAL
} from "../constants/fixture-properties";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";


export const RULES_GOAL = 0.4; // DONE
export const RULES_ASSIST = 0.3; // DONE
export const RULES_CLEANSHEET = 0.1; // DONE
export const RULES_CLEANSHEET_GK = 0.2; // DONE
export const RULES_SAVE = 0.3; // DONE
export const RULES_GOAL_FINAL = 0.6;
export const RULES_ASSIST_FINAL = 0.5;
export const RULES_CLEANSHEET_FINAL = 0.2;
export const RULES_CLEANSHEET_GK_FINAL = 0.4;
export const RULES_SAVE_FINAL = 0.5;
export const RULES_FIXTURE_WIN = 4;
export const RULES_FIXTURE_WIN_CAPTAIN = 5;
export const RULES_FIXTURE_WIN_FINAL = 10;
export const RULES_FIXTURE_WIN_FINAL_CAPTAIN = 10;
export const RULES_FIXTURE_TIE = 2;
export const RULES_FIXTURE_TIE_CAPTAIN = 2.5;
export const RULES_FIXTURE_TIE_FINAL = 5;
export const RULES_FIXTURE_TIE_FINAL_CAPTAIN = 5;
export const RULES_MATCH_WIN = 0.1;
export const RULES_MATCH_WIN_CAPTAIN = RULES_MATCH_WIN;
export const RULES_MATCH_WIN_FINAL = 0.2;
export const RULES_MATCH_WIN_FINAL_CAPTAIN = RULES_MATCH_TIE_FINAL;
export const RULES_MATCH_WIN_PENALTIES = RULES_MATCH_TIE;
export const RULES_MATCH_WIN_PENALTIES_CAPTAIN = RULES_MATCH_WIN_PENALTIES;
export const RULES_MATCH_WIN_PENALTIES_FINAL = RULES_MATCH_WIN_FINAL;
export const RULES_MATCH_WIN_PENALTIES_FINAL_CAPTAIN = RULES_MATCH_WIN_PENALTIES_FINAL;
export const RULES_MATCH_LOSE_PENALTIES = RULES_MATCH_WIN_PENALTIES;
export const RULES_MATCH_LOSE_PENALTIES_CAPTAIN = RULES_MATCH_WIN_PENALTIES_CAPTAIN;
export const RULES_MATCH_LOSE_PENALTIES_FINAL = RULES_MATCH_WIN_PENALTIES_FINAL;
export const RULES_MATCH_LOSE_PENALTIES_FINAL_CAPTAIN = RULES_MATCH_WIN_PENALTIES_FINAL;
export const RULES_MATCH_TIE = 0.1;
export const RULES_MATCH_TIE_CAPTAIN = RULES_MATCH_TIE;
export const RULES_MATCH_TIE_FINAL = 0.2;
export const RULES_MATCH_TIE_FINAL_CAPTAIN = RULES_MATCH_TIE_FINAL;
export const RULES_MVP = 1.5;
export const RULES_MVP_FINAL = 5;
export const RULES_FAIRPLAY = 1;
export const RULES_PUNISH = -1;
export const RULES_YELLOW = -0.1;
export const RULES_SECOND_YELLOW = -0.2;
export const RULES_RED = 0.3;

const getTeam = playerObject => {
  return shortTeamLabelsArray[playerObject.team];
};

const getName = playerObject => {
  let name = players[playerObject.id].name;
  if (playerObject.isCaptain) {
    name += " (C)";
  }
  if (playerObject.isGoalkeeper) {
    name += " (GK)";
  }
  return name;
};

const getGoals = (playerObject, closedMatches) => {
  let counter = 0;
  for (let i in closedMatches) {
    counter += closedMatches[i].events
      ? closedMatches[i].events.filter(
          item =>
            !item.isRemoved &&
            item.executerId === playerObject.id &&
            item.type === EVENT_TYPE_GOAL
        ).length
      : 0;
  }

  return counter;
};

const getAssists = (playerObject, closedMatches) => {
  let counter = 0;
  for (let i in closedMatches) {
    counter += closedMatches[i].events
      ? closedMatches[i].events.filter(
          item =>
            !item.isRemoved &&
            item.helperId === playerObject.id &&
            item.type === EVENT_TYPE_GOAL
        ).length
      : 0;
  }
  return counter;
};

const getCleanSheet = (playerObject, closedMatches) => {
  return getCleanSheetFromTeam(playerObject.team, closedMatches);
};

const getCleanSheetFromTeam = (teamId, closedMatches) => {
  let counter = 0;

  // count at home
  counter += closedMatches
    .filter(match => match.homeId == teamId)
    .filter(match =>
      match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && !event.isHome && event.type == EVENT_TYPE_GOAL
          ).length == 0
        : true
    ).length;

  // count aWAY
  counter += closedMatches
    .filter(match => match.awayId == teamId)
    .filter(match =>
      match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && event.isHome && event.type == EVENT_TYPE_GOAL
          ).length == 0
        : true
    ).length;
  return counter;
};

const getSaves = (playerObject, closedMatches) => {
  let counter = 0;
  for (let i in closedMatches) {
    counter += closedMatches[i].events
      ? closedMatches[i].events.filter(
          item =>
            !item.isRemoved &&
            item.executerId === playerObject.id &&
            item.type === EVENT_TYPE_WALL
        ).length
      : 0;
  }
  return counter;
};

export const calculatePoints = (players, fixtures, playerId, fixtureId) => {
  if (
    !fixtures ||
    !players ||
    fixtures.length <= fixtureId ||
    players.length <= playerId ||
    fixtures[fixtureId].isRemoved ||
    players[playerId].isRemoved
  ) {
    return 0;
  }

  let points = 0;
  let playerObject = null;
  const matches = fixtures[fixtureId].matches ? fixtures[fixtureId].matches : [];
  const closedMatches = matches.filter(item => !item.isRemoved && !item.isOpen);

  // Check that this player played in this fixture
  fixtures[fixtureId].playersList.filter(team => {
    return (
      team.players.filter(player => {
        if (player.id == playerId) {
          playerObject = { ...player, team: team.teamColorCode };
          return true;
        } else return false;
      }).length != 0
    );
  });

  if (!playerObject) return 0;

  const teamId = playerObject.team;

  if (fixtures[fixtureId].type == FIXTURE_TYPE_STANDARD) {
    // STANDARD FIXTURE

    // calculate individual points
    points += getGoals(playerObject, closedMatches)*RULES_GOAL
    points += getAssists(playerObject, closedMatches)*RULES_ASSIST
    points += getSaves(playerObject, closedMatches)*RULES_SAVE

    // calculate team points
    points += getCleanSheet(playerObject, closedMatches) * (playerObject.isGoalkeeper?RULES_CLEANSHEET_GK:RULES_CLEANSHEET)

    // calculate ended fixture points

  } else if (fixtures[fixtureId].type == FIXTURE_TYPE_FINAL) {
    // FINAL FIXTURE
  } else {
      // FRIENDLY
  }
  return points;
};
