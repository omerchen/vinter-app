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
export const RULES_EXTRA_POINT = 1;
export const RULES_YELLOW = -0.2;
export const RULES_SECOND_YELLOW = -0.4;
export const RULES_RED = -0.6;
export const RULES_YELLOW_FINAL = RULES_YELLOW;
export const RULES_SECOND_YELLOW_FINAL = RULES_SECOND_YELLOW;
export const RULES_RED_FINAL = RULES_RED;

const getWins = (fixture, teamId) => {
  return fixture.matches?fixture.matches.filter(match => !match.isRemoved && match.winnerId == teamId).length:0;
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
  let pointsObject = {
    points: 0,
    appearence: false,
    goals: 0,
    assists: 0,
    cleansheets: 0,
    saves: 0,
    teamWin: false,
    teamTie: false,
    yellows: 0,
    secondYellows: 0,
    reds: 0,
    isCaptain: false,
    isGoalkeeper: false,
    mvp: false,
    matchWins:0,
    teamId: null,
  };
  if (
    !fixtures ||
    !players ||
    fixtures.length <= fixtureId ||
    players.length <= playerId ||
    fixtures[fixtureId].isRemoved ||
    players[playerId].isRemoved
  ) {
    return pointsObject;
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

  if (!playerObject) return pointsObject;

  const teamId = playerObject.team;
  
  pointsObject.appearence = true;
  pointsObject.teamId = teamId;

  pointsObject.isCaptain = playerObject.isCaptain;
  pointsObject.isGoalkeeper = playerObject.isGoalkeeper;

  pointsObject.goals = getGoals(playerObject, closedMatches);
  pointsObject.assists = getAssists(playerObject, closedMatches);
  pointsObject.saves = getSaves(playerObject, closedMatches);
  pointsObject.yellows = getYellows(playerObject, closedMatches);
  pointsObject.secondYellows = getSecondYellows(playerObject, closedMatches);
  pointsObject.reds = getReds(playerObject, closedMatches);
  pointsObject.cleansheets = getCleanSheet(playerObject, closedMatches);
  pointsObject.fixtureType = fixtures[fixtureId].type;


  if (fixtures[fixtureId].type == FIXTURE_TYPE_STANDARD) {
    // STANDARD FIXTURE

    // calculate individual points
    points += pointsObject.goals * RULES_GOAL;
    points += pointsObject.assists * RULES_ASSIST;
    points += pointsObject.saves * RULES_SAVE;
    points += pointsObject.yellows * RULES_YELLOW;
    points += pointsObject.secondYellows * RULES_SECOND_YELLOW;
    points += pointsObject.reds * RULES_RED;

    // calculate team points
    points +=
      pointsObject.cleansheets *
      (playerObject.isGoalkeeper ? RULES_CLEANSHEET_GK : RULES_CLEANSHEET);

    // Team Win
    let i = teamId;
    let wins = closedMatches.filter(match => match.winnerId == i);
    pointsObject.matchWins+= wins.length
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

    pointsObject.wins = wins.length;
    pointsObject.penaltyWins = penaltyWins.length;
    pointsObject.loses = loses.length;
    pointsObject.penaltyLoses = penaltyLoses.length;
    pointsObject.ties = ties.length;
    pointsObject.noGoalsTies = no_goals_tie.length;

    if (playerObject.isCaptain) {
      points += (wins.length - penaltyWins.length) * RULES_MATCH_WIN_CAPTAIN;

      points += penaltyWins.length * RULES_MATCH_WIN_PENALTIES_CAPTAIN;

      points += penaltyLoses.length * RULES_MATCH_LOSE_PENALTIES_CAPTAIN;

      points += (ties.length - no_goals_tie.length) * RULES_MATCH_TIE_CAPTAIN;
      points += no_goals_tie.length * RULES_MATCH_NO_GOALS_TIE_CAPTAIN;
    } else {
      points += (wins.length - penaltyWins.length) * RULES_MATCH_WIN;

      points += penaltyWins.length * RULES_MATCH_WIN_PENALTIES;

      points += penaltyLoses.length * RULES_MATCH_LOSE_PENALTIES;

      points += (ties.length - no_goals_tie.length) * RULES_MATCH_TIE;
      points += no_goals_tie.length * RULES_MATCH_NO_GOALS_TIE;
    }

    // calculate ended fixture points
    if (!fixtures[fixtureId].isOpen) {
      // Check if mvp
      if (fixtures[fixtureId].mvpId == playerId) {
        points += 1 * RULES_MVP;
        pointsObject.mvp = true;
      } else {
        pointsObject.mvp = false;
      }

      let teamWins = getWins(fixtures[fixtureId], teamId);
      let maxRivalWins = 0;

      for (let i in fixtures[fixtureId].playersList) {
        if (i == teamId) continue;

        maxRivalWins = Math.max(maxRivalWins, getWins(fixtures[fixtureId], i));
      }

      pointsObject.teamWin = false;
      pointsObject.teamTie = false;

      if (teamWins > maxRivalWins) {
        // team win fixture
        pointsObject.teamWin = true;
        points +=
          1 *
          (playerObject.isCaptain
            ? RULES_FIXTURE_WIN_CAPTAIN
            : RULES_FIXTURE_WIN);
      } else if (teamWins == maxRivalWins) {
        // team tie fixture
        pointsObject.teamTie = true;
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
    points += pointsObject.goals * RULES_GOAL_FINAL;
    points += pointsObject.assists * RULES_ASSIST_FINAL;
    points += pointsObject.saves * RULES_SAVE_FINAL;
    points += pointsObject.yellows * RULES_YELLOW_FINAL;
    points += pointsObject.secondYellows * RULES_SECOND_YELLOW_FINAL;
    points += pointsObject.reds * RULES_RED_FINAL;

    // calculate team points
    points +=
      pointsObject.cleansheets *
      (playerObject.isGoalkeeper
        ? RULES_CLEANSHEET_GK_FINAL
        : RULES_CLEANSHEET_FINAL);

    // Team Win
    let i = teamId;
    let wins = closedMatches.filter(match => match.winnerId == i);
    pointsObject.matchWins+= wins.length
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

    pointsObject.wins = wins.length;
    pointsObject.penaltyWins = penaltyWins.length;
    pointsObject.loses = loses.length;
    pointsObject.penaltyLoses = penaltyLoses.length;
    pointsObject.ties = ties.length;
    pointsObject.noGoalsTies = no_goals_tie.length;

    if (playerObject.isCaptain) {
      points +=
        (wins.length - penaltyWins.length) * RULES_MATCH_WIN_FINAL_CAPTAIN;

      points += penaltyWins.length * RULES_MATCH_WIN_PENALTIES_FINAL_CAPTAIN;

      points += penaltyLoses.length * RULES_MATCH_LOSE_PENALTIES_FINAL_CAPTAIN;

      points +=
        (ties.length - no_goals_tie.length) * RULES_MATCH_TIE_FINAL_CAPTAIN;
      points += no_goals_tie.length * RULES_MATCH_NO_GOALS_TIE_FINAL_CAPTAIN;
    } else {
      points += (wins.length - penaltyWins.length) * RULES_MATCH_WIN_FINAL;

      points += penaltyWins.length * RULES_MATCH_WIN_PENALTIES_FINAL;

      points += penaltyLoses.length * RULES_MATCH_LOSE_PENALTIES_FINAL;

      points += (ties.length - no_goals_tie.length) * RULES_MATCH_TIE_FINAL;
      points += no_goals_tie.length * RULES_MATCH_NO_GOALS_TIE_FINAL;
    }

    // calculate ended fixture points
    if (!fixtures[fixtureId].isOpen) {
      // Check if mvp
      if (fixtures[fixtureId].mvpId == playerId) {
        points += 1 * RULES_MVP_FINAL;
        pointsObject.mvp = true;
      } else {
        pointsObject.mvp = false;
      }

      let teamWins = getWins(fixtures[fixtureId], teamId);
      let maxRivalWins = 0;

      for (let i in fixtures[fixtureId].playersList) {
        if (i == teamId) continue;

        maxRivalWins = Math.max(maxRivalWins, getWins(fixtures[fixtureId], i));
      }

      pointsObject.teamWin = false;
      pointsObject.teamTie = false;

      if (teamWins > maxRivalWins) {
        // team win fixture
        pointsObject.teamWin = true;
        points +=
          1 *
          (playerObject.isCaptain
            ? RULES_FIXTURE_WIN_FINAL_CAPTAIN
            : RULES_FIXTURE_WIN_FINAL);
      } else if (teamWins == maxRivalWins) {
        // team tie fixture
        pointsObject.teamTie = true;
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

  let zero = 0

  pointsObject.points = points.toFixed(1) == 0 ? zero.toFixed(1) : points.toFixed(1);
  return pointsObject;
};
