import { calculatePoints } from "./rules";

const calculateFixturePlayerRecords = (players, fixtures) => {
  let playersTracker = [...players];

  // init playersTracker
  for (let i in playersTracker) {
    playersTracker[i] = {
      ...playersTracker[i],
      mostGoals: undefined,
      mostAssists: undefined,
      mostSaves: undefined,
      mostPoints: undefined,
      mostSavesGk: undefined
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

        if (
          playersTracker[p].mostAssists == undefined ||
          playersTracker[p].mostAssists.value < pointsObject.assists
        ) {
          playersTracker[p].mostAssists = {
            fixtureId: f,
            value: pointsObject.assists
          };
        }

        if (
          playersTracker[p].mostPoints == undefined ||
          playersTracker[p].mostPoints.value < parseFloat(pointsObject.points)
        ) {
          playersTracker[p].mostPoints = {
            fixtureId: f,
            value: parseFloat(pointsObject.points)
          };
        }

        if (pointsObject.isGoalkeeper) {
          if (
            playersTracker[p].mostSavesGk == undefined ||
            playersTracker[p].mostSavesGk.value < pointsObject.saves
          ) {
            playersTracker[p].mostSavesGk = {
              fixtureId: f,
              value: pointsObject.saves
            };
          }
        } else {
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
  }

  // init record object
  let fixturePlayerRecord = {
    mostGoals: undefined,
    mostAssists: undefined,
    mostPoints: undefined,
    mostSaves: undefined,
    mostSavesGk: undefined
  };

  // find the best record
  for (let p in playersTracker) {
    if (
      playersTracker[p].mostGoals != undefined &&
      (fixturePlayerRecord.mostGoals == undefined ||
        fixturePlayerRecord.mostGoals.value < playersTracker[p].mostGoals.value)
    ) {
      fixturePlayerRecord.mostGoals = {
        playerId: p,
        ...playersTracker[p].mostGoals
      };
    }

    if (
      playersTracker[p].mostAssists != undefined &&
      (fixturePlayerRecord.mostAssists == undefined ||
        fixturePlayerRecord.mostAssists.value <
          playersTracker[p].mostAssists.value)
    ) {
      fixturePlayerRecord.mostAssists = {
        playerId: p,
        ...playersTracker[p].mostAssists
      };
    }

    if (
      playersTracker[p].mostPoints != undefined &&
      (fixturePlayerRecord.mostPoints == undefined ||
        fixturePlayerRecord.mostPoints.value <
          playersTracker[p].mostPoints.value)
    ) {
      fixturePlayerRecord.mostPoints = {
        playerId: p,
        ...playersTracker[p].mostPoints
      };
    }

    if (
      playersTracker[p].mostSaves != undefined &&
      (fixturePlayerRecord.mostSaves == undefined ||
        fixturePlayerRecord.mostSaves.value < playersTracker[p].mostSaves.value)
    ) {
      fixturePlayerRecord.mostSaves = {
        playerId: p,
        ...playersTracker[p].mostSaves
      };
    }

    if (
      playersTracker[p].mostSavesGk != undefined &&
      (fixturePlayerRecord.mostSavesGk == undefined ||
        fixturePlayerRecord.mostSavesGk.value <
          playersTracker[p].mostSavesGk.value)
    ) {
      fixturePlayerRecord.mostSavesGk = {
        playerId: p,
        ...playersTracker[p].mostSavesGk
      };
    }
  }

  if (fixturePlayerRecord.mostPoints != undefined) {
    fixturePlayerRecord.mostPoints.value = fixturePlayerRecord.mostPoints.value.toFixed(1)
  }

  return fixturePlayerRecord;
};

const calculatePenaltyGrade = (wins, loses) => {
  return (wins + 1) / (wins + loses + 2);
};

// if 2>1 => return +0, if 1>2 return -0, if 1=2 return 0
const comparePenaltyStats = (wins1, loses1, wins2, loses2) => {
  return (
    calculatePenaltyGrade(wins2, loses2) - calculatePenaltyGrade(wins1, loses1)
  );
};

const calculatePlayerRecords = (players, fixtures) => {
  let playerRecords = {
    penaltyKing: undefined
  };

  let playersTracker = [...players];

  // init playersTracker
  for (let i in playersTracker) {
    playersTracker[i] = {
      ...playersTracker[i],
      penaltyWins: 0,
      penaltyLoses: 0
    };
  }

  // count penalties for each player
  for (let p in playersTracker) {
    for (let f in fixtures) {
      let pointObject = calculatePoints(players, fixtures, p, f);
      playersTracker[p].penaltyWins += pointObject.matchWinsPenalty;
      playersTracker[p].penaltyLoses += pointObject.matchLosesPenalty;
    }
  }

  // find the best penalty winner
  for (let p in playersTracker) {
    if (
      playersTracker[p].penaltyWins > 0 ||
      playersTracker[p].penaltyLoses > 0
    ) {
      if (
        playerRecords.penaltyKing == undefined ||
        comparePenaltyStats(
          playerRecords.penaltyKing.penaltyWins,
          playerRecords.penaltyKing.penaltyLoses,
          playersTracker[p].penaltyWins,
          playersTracker[p].penaltyLoses
        ) > 0
      ) {
        playerRecords.penaltyKing = {
          playerId: p,
          penaltyWins: playersTracker[p].penaltyWins,
          penaltyLoses: playersTracker[p].penaltyLoses,
          value:
            "(" +
            (
              (playersTracker[p].penaltyWins * 100) /
              (playersTracker[p].penaltyWins + playersTracker[p].penaltyLoses)
            ).toFixed(0) +
            "%) " +
            playersTracker[p].penaltyWins
        };
      }
    }
  }
  return playerRecords;
};

export const calculateRecords = (players, fixtures) => {
  let records = {
    fixturePlayerRecord: calculateFixturePlayerRecords(players, fixtures),
    playerRecords: calculatePlayerRecords(players, fixtures),
    matchPlayerReacords: {},
    matchRecords: {},
    fixtureTeamRecords: {},
    fixtureRecords: {},
    twoPlayersRecords: {}
  };

  return records;
};
