import {
  FIXTURE_TYPE_STANDARD,
  FIXTURE_TYPE_FINAL
} from "../constants/fixture-properties";
import {
  EVENT_TYPE_GOAL,
  EVENT_TYPE_WALL,
  EVENT_TYPE_YELLOW,
  EVENT_TYPE_RED,
  EVENT_TYPE_SECOND_YELLOW
} from "../constants/event-types";

export const RULES_GOAL = 0.8;
export const RULES_ASSIST = 0.6;
export const RULES_CLEANSHEET = 0.2;
export const RULES_CLEANSHEET_GK = 0.4;
export const RULES_SAVE = 0.6;
export const RULES_GOAL_FINAL = 1.2;
export const RULES_ASSIST_FINAL = 1.5;
export const RULES_CLEANSHEET_FINAL = 0.4;
export const RULES_CLEANSHEET_GK_FINAL = 0.8;
export const RULES_SAVE_FINAL = 1;
export const RULES_FIXTURE_WIN = 8;
export const RULES_FIXTURE_WIN_CAPTAIN = 10;
export const RULES_FIXTURE_WIN_FINAL = 20;
export const RULES_FIXTURE_WIN_FINAL_CAPTAIN = 20;
export const RULES_FIXTURE_TIE = 4;
export const RULES_FIXTURE_TIE_CAPTAIN = 5;
export const RULES_FIXTURE_TIE_FINAL = 10;
export const RULES_FIXTURE_TIE_FINAL_CAPTAIN = 10;
export const RULES_MATCH_WIN = 0.2;
export const RULES_MATCH_TIE = 0.1;
export const RULES_MATCH_TIE_CAPTAIN = RULES_MATCH_TIE;
export const RULES_MATCH_TIE_FINAL = 0.2;
export const RULES_MATCH_TIE_FINAL_CAPTAIN = RULES_MATCH_TIE_FINAL;
export const RULES_MATCH_NO_GOALS_TIE = 0;
export const RULES_MATCH_NO_GOALS_TIE_CAPTAIN = RULES_MATCH_NO_GOALS_TIE;
export const RULES_MATCH_NO_GOALS_TIE_FINAL = 0;
export const RULES_MATCH_NO_GOALS_TIE_FINAL_CAPTAIN = RULES_MATCH_NO_GOALS_TIE_FINAL;
export const RULES_MATCH_WIN_CAPTAIN = RULES_MATCH_WIN;
export const RULES_MATCH_WIN_FINAL = 0.4;
export const RULES_MATCH_WIN_FINAL_CAPTAIN = RULES_MATCH_TIE_FINAL;
export const RULES_MATCH_WIN_PENALTIES = RULES_MATCH_TIE;
export const RULES_MATCH_WIN_PENALTIES_CAPTAIN = RULES_MATCH_WIN_PENALTIES;
export const RULES_MATCH_WIN_PENALTIES_FINAL = RULES_MATCH_TIE_FINAL;
export const RULES_MATCH_WIN_PENALTIES_FINAL_CAPTAIN = RULES_MATCH_WIN_PENALTIES_FINAL;
export const RULES_MATCH_LOSE_PENALTIES = 0;
export const RULES_MATCH_LOSE_PENALTIES_CAPTAIN = RULES_MATCH_LOSE_PENALTIES;
export const RULES_MATCH_LOSE_PENALTIES_FINAL = RULES_MATCH_LOSE_PENALTIES;
export const RULES_MATCH_LOSE_PENALTIES_FINAL_CAPTAIN = RULES_MATCH_LOSE_PENALTIES;
export const RULES_MVP = 3;
export const RULES_MVP_FINAL = 10;
export const RULES_FAIRPLAY = 2; // TODO: add later
export const RULES_PUNISH = -2; // TODO: add later
export const RULES_YELLOW = -0.2;
export const RULES_SECOND_YELLOW = -0.4;
export const RULES_RED = -0.6;
export const RULES_YELLOW_FINAL = RULES_YELLOW;
export const RULES_SECOND_YELLOW_FINAL = RULES_SECOND_YELLOW;
export const RULES_RED_FINAL = RULES_RED;

const getWins = (fixture, teamId) => {
  return fixture.matches.filter(match => match.winnerId == teamId).length;
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

const getYellows = (playerObject, closedMatches) => {
  let counter = 0;
  for (let i in closedMatches) {
    counter += closedMatches[i].events
      ? closedMatches[i].events.filter(
          item =>
            !item.isRemoved &&
            item.executerId === playerObject.id &&
            item.type === EVENT_TYPE_YELLOW
        ).length
      : 0;
  }

  return counter;
};

const getSecondYellows = (playerObject, closedMatches) => {
  let counter = 0;
  for (let i in closedMatches) {
    counter += closedMatches[i].events
      ? closedMatches[i].events.filter(
          item =>
            !item.isRemoved &&
            item.executerId === playerObject.id &&
            item.type === EVENT_TYPE_SECOND_YELLOW
        ).length
      : 0;
  }

  return counter;
};

const getReds = (playerObject, closedMatches) => {
  let counter = 0;
  for (let i in closedMatches) {
    counter += closedMatches[i].events
      ? closedMatches[i].events.filter(
          item =>
            !item.isRemoved &&
            item.executerId === playerObject.id &&
            item.type === EVENT_TYPE_RED
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
  const matches = fixtures[fixtureId].matches
    ? fixtures[fixtureId].matches
    : [];
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
    points += getGoals(playerObject, closedMatches) * RULES_GOAL;
    points += getAssists(playerObject, closedMatches) * RULES_ASSIST;
    points += getSaves(playerObject, closedMatches) * RULES_SAVE;
    points += getYellows(playerObject, closedMatches) * RULES_YELLOW;
    points +=
      getSecondYellows(playerObject, closedMatches) * RULES_SECOND_YELLOW;
    points += getReds(playerObject, closedMatches) * RULES_RED;

    // calculate team points
    points +=
      getCleanSheet(playerObject, closedMatches) *
      (playerObject.isGoalkeeper ? RULES_CLEANSHEET_GK : RULES_CLEANSHEET);

    // Team Win
    let i = teamId;
    let wins = closedMatches.filter(match => match.winnerId == i);
    let penaltyWins = wins.filter(match => {
      let homeGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;
      let awayGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && !event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;

      return homeGoals == awayGoals;
    });

    // Team Lose
    let loses = closedMatches.filter(
      match =>
        match.winnerId != i &&
        match.winnerId != null &&
        match.winnerId != undefined &&
        (match.homeId == i || match.awayId == i)
    );
    let penaltyLoses = loses.filter(match => {
      let homeGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;
      let awayGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && !event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;

      return homeGoals == awayGoals;
    });

    // Team tie
    let ties = closedMatches.filter(
      match =>
        (match.winnerId == null || match.winnerId == undefined) &&
        (match.homeId == i || match.awayId == i)
    );

    let no_goals_tie = ties.filter(
      match =>
        !match.events ||
        match.events.filter(
          event => !event.isRemoved && event.type == EVENT_TYPE_GOAL
        ).length == 0
    );

    if (playerObject.isCaptain) {
      points += (wins.length - penaltyWins.length) * RULES_MATCH_WIN_CAPTAIN;

      points += penaltyWins.length * RULES_MATCH_WIN_PENALTIES_CAPTAIN;

      points += penaltyLoses.length * RULES_MATCH_LOSE_PENALTIES_CAPTAIN;

      points += (ties.length - no_goals_tie.length) * RULES_MATCH_TIE_CAPTAIN;
      points += no_goals_tie.length * RULES_MATCH_NO_GOALS_TIE_CAPTAIN
    } else {
      points += (wins.length - penaltyWins.length) * RULES_MATCH_WIN;

      points += penaltyWins.length * RULES_MATCH_WIN_PENALTIES;

      points += penaltyLoses.length * RULES_MATCH_LOSE_PENALTIES;

      points += (ties.length - no_goals_tie.length) * RULES_MATCH_TIE;
      points += no_goals_tie.length * RULES_MATCH_NO_GOALS_TIE
    }

    // calculate ended fixture points
    if (!fixtures[fixtureId].isOpen) {
      // Check if mvp
      if (fixtures[fixtureId].mvpId == playerId) {
        points += 1 * RULES_MVP;
      }

      let teamWins = getWins(fixtures[fixtureId], teamId);
      let maxRivalWins = 0;

      for (let i in fixtures[fixtureId].playersList) {
        if (i == teamId) continue;

        maxRivalWins = Math.max(maxRivalWins, getWins(fixtures[fixtureId], i));
      }

      if (teamWins > maxRivalWins) {
        // team win fixture
        points +=
          1 *
          (playerObject.isCaptain
            ? RULES_FIXTURE_WIN_CAPTAIN
            : RULES_FIXTURE_WIN);
      } else if (teamWins == maxRivalWins) {
        // team tie fixture
        points +=
          1 *
          (playerObject.isCaptain
            ? RULES_FIXTURE_TIE_CAPTAIN
            : RULES_FIXTURE_TIE);
      } else {
        // team lose fixture
        // do nothing
      }
    }
  } else if (fixtures[fixtureId].type == FIXTURE_TYPE_FINAL) {
    // FINAL FIXTURE

    // calculate individual points
    points += getGoals(playerObject, closedMatches) * RULES_GOAL_FINAL;
    points += getAssists(playerObject, closedMatches) * RULES_ASSIST_FINAL;
    points += getSaves(playerObject, closedMatches) * RULES_SAVE_FINAL;
    points += getYellows(playerObject, closedMatches) * RULES_YELLOW_FINAL;
    points +=
      getSecondYellows(playerObject, closedMatches) * RULES_SECOND_YELLOW_FINAL;
    points += getReds(playerObject, closedMatches) * RULES_RED_FINAL;

    // calculate team points
    points +=
      getCleanSheet(playerObject, closedMatches) *
      (playerObject.isGoalkeeper
        ? RULES_CLEANSHEET_GK_FINAL
        : RULES_CLEANSHEET_FINAL);

    // Team Win
    let i = teamId;
    let wins = closedMatches.filter(match => match.winnerId == i);
    let penaltyWins = wins.filter(match => {
      let homeGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;
      let awayGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && !event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;

      return homeGoals == awayGoals;
    });

    // Team Lose
    let loses = closedMatches.filter(
      match =>
        match.winnerId != i &&
        match.winnerId != null &&
        match.winnerId != undefined &&
        (match.homeId == i || match.awayId == i)
    );
    let penaltyLoses = loses.filter(match => {
      let homeGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;
      let awayGoals = match.events
        ? match.events.filter(
            event =>
              !event.isRemoved && !event.isHome && event.type == EVENT_TYPE_GOAL
          ).length
        : 0;

      return homeGoals == awayGoals;
    });

    // Team tie
    let ties = closedMatches.filter(
      match =>
        (match.winnerId == null || match.winnerId == undefined) &&
        (match.homeId == i || match.awayId == i)
    );

    let no_goals_tie = ties.filter(
      match =>
        !match.events ||
        match.events.filter(
          event => !event.isRemoved && event.type == EVENT_TYPE_GOAL
        ).length == 0
    );

    if (playerObject.isCaptain) {
      points +=
        (wins.length - penaltyWins.length) * RULES_MATCH_WIN_FINAL_CAPTAIN;

      points += penaltyWins.length * RULES_MATCH_WIN_PENALTIES_FINAL_CAPTAIN;

      points += penaltyLoses.length * RULES_MATCH_LOSE_PENALTIES_FINAL_CAPTAIN;

      points += (ties.length - no_goals_tie.length) * RULES_MATCH_TIE_FINAL_CAPTAIN;
      points += no_goals_tie.length * RULES_MATCH_NO_GOALS_TIE_FINAL_CAPTAIN
    } else {
      points += (wins.length - penaltyWins.length) * RULES_MATCH_WIN_FINAL;

      points += penaltyWins.length * RULES_MATCH_WIN_PENALTIES_FINAL;

      points += penaltyLoses.length * RULES_MATCH_LOSE_PENALTIES_FINAL;

      points += (ties.length - no_goals_tie.length) * RULES_MATCH_TIE_FINAL;
      points += no_goals_tie.length * RULES_MATCH_NO_GOALS_TIE_FINAL
    }

    // calculate ended fixture points
    if (!fixtures[fixtureId].isOpen) {
      // Check if mvp
      if (fixtures[fixtureId].mvpId == playerId) {
        points += 1 * RULES_MVP_FINAL;
      }

      let teamWins = getWins(fixtures[fixtureId], teamId);
      let maxRivalWins = 0;

      for (let i in fixtures[fixtureId].playersList) {
        if (i == teamId) continue;

        maxRivalWins = Math.max(maxRivalWins, getWins(fixtures[fixtureId], i));
      }

      if (teamWins > maxRivalWins) {
        // team win fixture
        points +=
          1 *
          (playerObject.isCaptain
            ? RULES_FIXTURE_WIN_FINAL_CAPTAIN
            : RULES_FIXTURE_WIN_FINAL);
      } else if (teamWins == maxRivalWins) {
        // team tie fixture
        points +=
          1 *
          (playerObject.isCaptain
            ? RULES_FIXTURE_TIE_FINAL_CAPTAIN
            : RULES_FIXTURE_TIE_FINAL);
      }
    } else {
      // team lose fixture
      // do nothing
    }
  } else {
    // FRIENDLY
  }
  return points.toFixed(1) == 0 ? 0 : points.toFixed(1);
};
