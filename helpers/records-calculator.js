import { calculatePoints } from "./rules";

export const calculateFixturePlayerRecords = (players, fixtures) => {
  let playersTracker = [...players];

  // init playersTracker
  for (let i in playersTracker) {
    playersTracker[i] = {
      ...playersTracker[i],
      mostGoals: undefined,
      mostAssists: undefined,
      mostSaves: undefined,
      mostPoints: undefined
    };
  }

  // calculate each players best record
  for (let p in playersTracker) {
    for (let f in fixtures) {
      if (fixtures[f].isRemoved) continue;

      let pointsObject = calculatePoints(players, fixtures, p, f);

      if (pointsObject.appearence) {
        if (
          playersTracker[p].mostGoals == undefined ||
          playersTracker[p].mostGoals.value < pointsObject.goals
        ) {
          playersTracker[p].mostGoals = {
            fixtureId: f,
            value: pointsObject.goals
          };
        }
      }

      if (pointsObject.appearence) {
        if (
          playersTracker[p].mostAssists == undefined ||
          playersTracker[p].mostAssists.value < pointsObject.assists
        ) {
          playersTracker[p].mostAssists = {
            fixtureId: f,
            value: pointsObject.assists
          };
        }
      }

      if (pointsObject.appearence) {
        if (
          playersTracker[p].mostPoints == undefined ||
          playersTracker[p].mostPoints.value < pointsObject.points
        ) {
          playersTracker[p].mostPoints = {
            fixtureId: f,
            value: pointsObject.points
          };
        }
      }

      if (pointsObject.appearence) {
        if (
          playersTracker[p].mostSaves == undefined ||
          playersTracker[p].mostSaves.value < pointsObject.saves
        ) {
          playersTracker[p].mostSaves = {
            fixtureId: f,
            value: pointsObject.saves
          };
        }
      }
    }
  }

  // init record object
  let fixturePlayerRecord = {
    mostGoals: undefined,
    mostAssists: undefined,
    mostPoints: undefined,
    mostSaves: undefined
  };

  // find the best record
  for (let p in playersTracker) {
    if (
        playersTracker[p].mostGoals != undefined &&
        (fixturePlayerRecord.mostGoals == undefined ||
          fixturePlayerRecord.mostGoals.value < playersTracker[p].mostGoals.value)
      ) {
          fixturePlayerRecord.mostGoals = {playerId: p, ...playersTracker[p].mostGoals}
      }

      if (
        playersTracker[p].mostAssists != undefined &&
        (fixturePlayerRecord.mostAssists == undefined ||
          fixturePlayerRecord.mostAssists.value < playersTracker[p].mostAssists.value)
      ) {
          fixturePlayerRecord.mostAssists = {playerId: p, ...playersTracker[p].mostAssists}
      }

      if (
        playersTracker[p].mostPoints != undefined &&
        (fixturePlayerRecord.mostPoints == undefined ||
          fixturePlayerRecord.mostPoints.value < playersTracker[p].mostPoints.value)
      ) {
          fixturePlayerRecord.mostPoints = {playerId: p, ...playersTracker[p].mostPoints}
      }

      if (
        playersTracker[p].mostPoints != undefined &&
        (fixturePlayerRecord.mostPoints == undefined ||
          fixturePlayerRecord.mostPoints.value < playersTracker[p].mostPoints.value)
      ) {
          fixturePlayerRecord.mostPoints = {playerId: p, ...playersTracker[p].mostPoints}
      }
  }
};

export const calculateRecords = (players, fixtures) => {
  let records = {
    fixturePlayerRecord: calculateFixturePlayerRecords(players, fixtures),
    playerRecords: {},
    matchPlayerReacords: {},
    matchRecords: {},
    fixtureTeamRecords: {},
    fixtureRecords: {},
    twoPlayersRecords: {}
  };

  return records
};
