import { calculatePoints } from "./rules";
import { parseSecondsToTime } from "./time-parser";

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
    fixturePlayerRecord.mostPoints.value = fixturePlayerRecord.mostPoints.value.toFixed(
      1
    );
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
    penaltyKing: undefined,
    mostPointsAvg: undefined,
    mostGoalsAvg: undefined,
    mostAssistsAvg: undefined,
    mostGoalsForAvg: undefined,
    mostSavesAvg: undefined,
    mostSavesGkAvg: undefined,
    mostCleansheetAvg: undefined,
    mostCleansheetGkAvg: undefined,
    leastGoalsAgainstAvg: undefined,
    leastGoalsAgainstGkAvg: undefined,
    mostWinnerAvg: undefined
  };

  let playersTracker = [...players];

  // init playersTracker
  for (let i in playersTracker) {
    playersTracker[i] = {
      ...playersTracker[i],
      penaltyWins: 0,
      penaltyLoses: 0,
      mostPointsAvg: undefined,
      mostGoalsAvg: undefined,
      mostAssistsAvg: undefined,
      mostGoalsForAvg: undefined,
      mostSavesAvg: undefined,
      mostSavesGkAvg: undefined,
      mostCleansheetAvg: undefined,
      mostCleansheetGkAvg: undefined,
      leastGoalsAgainstAvg: undefined,
      leastGoalsAgainstGkAvg: undefined,
      mostWinnerAvg: undefined
    };
  }

  // count penalties for each player
  for (let p in playersTracker) {
    for (let f in fixtures) {
      let pointObject = calculatePoints(players, fixtures, p, f);
      playersTracker[p].penaltyWins += pointObject.matchWinsPenalty;
      playersTracker[p].penaltyLoses += pointObject.matchLosesPenalty;

      let points = parseFloat(pointObject.points);

      if (pointObject.appearence) {
        if (playersTracker[p].mostPointsAvg == undefined) {
          playersTracker[p].mostPointsAvg = {
            amount: points,
            appearences: 1
          };
        } else {
          playersTracker[p].mostPointsAvg.amount += points;
          playersTracker[p].mostPointsAvg.appearences += 1;
        }

        if (playersTracker[p].mostGoalsAvg == undefined) {
          playersTracker[p].mostGoalsAvg = {
            amount: pointObject.goals,
            appearences: 1
          };
        } else {
          playersTracker[p].mostGoalsAvg.amount += pointObject.goals;
          playersTracker[p].mostGoalsAvg.appearences += 1;
        }

        if (
          playersTracker[p].mostWinnerAvg == undefined ||
          pointObject.matchWins +
            pointObject.matchLoses +
            pointObject.matchTies ==
            0
        ) {
          playersTracker[p].mostWinnerAvg = {
            amount: pointObject.matchWins,
            appearences:
              pointObject.matchWins +
              pointObject.matchLoses +
              pointObject.matchTies
          };
        } else {
          playersTracker[p].mostWinnerAvg.amount += pointObject.matchWins;
          playersTracker[p].mostWinnerAvg.appearences +=
            pointObject.matchWins +
            pointObject.matchLoses +
            pointObject.matchTies;
        }

        if (playersTracker[p].mostAssistsAvg == undefined) {
          playersTracker[p].mostAssistsAvg = {
            amount: pointObject.assists,
            appearences: 1
          };
        } else {
          playersTracker[p].mostAssistsAvg.amount += pointObject.assists;
          playersTracker[p].mostAssistsAvg.appearences += 1;
        }

        if (playersTracker[p].mostGoalsForAvg == undefined) {
          playersTracker[p].mostGoalsForAvg = {
            amount: pointObject.teamGoalsFor,
            appearences: 1
          };
        } else {
          playersTracker[p].mostGoalsForAvg.amount += pointObject.teamGoalsFor;
          playersTracker[p].mostGoalsForAvg.appearences += 1;
        }

        if (pointObject.isGoalkeeper) {
          if (playersTracker[p].mostSavesGkAvg == undefined) {
            playersTracker[p].mostSavesGkAvg = {
              amount: pointObject.saves,
              appearences: 1
            };
          } else {
            playersTracker[p].mostSavesGkAvg.amount += pointObject.saves;
            playersTracker[p].mostSavesGkAvg.appearences += 1;
          }

          if (playersTracker[p].mostCleansheetGkAvg == undefined) {
            playersTracker[p].mostCleansheetGkAvg = {
              amount: pointObject.cleansheets,
              appearences: 1
            };
          } else {
            playersTracker[p].mostCleansheetGkAvg.amount +=
              pointObject.cleansheets;
            playersTracker[p].mostCleansheetGkAvg.appearences += 1;
          }

          if (playersTracker[p].leastGoalsAgainstGkAvg == undefined) {
            playersTracker[p].leastGoalsAgainstGkAvg = {
              amount: pointObject.teamGoalAgainst,
              appearences: 1
            };
          } else {
            playersTracker[p].leastGoalsAgainstGkAvg.amount +=
              pointObject.teamGoalAgainst;
            playersTracker[p].leastGoalsAgainstGkAvg.appearences += 1;
          }
        } else {
          if (playersTracker[p].mostSavesAvg == undefined) {
            playersTracker[p].mostSavesAvg = {
              amount: pointObject.saves,
              appearences: 1
            };
          } else {
            playersTracker[p].mostSavesAvg.amount += pointObject.saves;
            playersTracker[p].mostSavesAvg.appearences += 1;
          }

          if (playersTracker[p].mostCleansheetAvg == undefined) {
            playersTracker[p].mostCleansheetAvg = {
              amount: pointObject.cleansheets,
              appearences: 1
            };
          } else {
            playersTracker[p].mostCleansheetAvg.amount +=
              pointObject.cleansheets;
            playersTracker[p].mostCleansheetAvg.appearences += 1;
          }

          if (playersTracker[p].leastGoalsAgainstAvg == undefined) {
            playersTracker[p].leastGoalsAgainstAvg = {
              amount: pointObject.teamGoalAgainst,
              appearences: 1
            };
          } else {
            playersTracker[p].leastGoalsAgainstAvg.amount +=
              pointObject.teamGoalAgainst;
            playersTracker[p].leastGoalsAgainstAvg.appearences += 1;
          }
        }
      }
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

    if (
      playersTracker[p].mostGoalsAvg != undefined &&
      (playerRecords.mostGoalsAvg == undefined ||
        playerRecords.mostGoalsAvg.realValue <
          playersTracker[p].mostGoalsAvg.amount /
            playersTracker[p].mostGoalsAvg.appearences)
    ) {
      playerRecords.mostGoalsAvg = {
        value: (
          playersTracker[p].mostGoalsAvg.amount /
          playersTracker[p].mostGoalsAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].mostGoalsAvg.amount /
          playersTracker[p].mostGoalsAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostGoalsAvg.amount,
        app: playersTracker[p].mostGoalsAvg.appearences
      };
    }

    if (
      playersTracker[p].mostAssistsAvg != undefined &&
      (playerRecords.mostAssistsAvg == undefined ||
        playerRecords.mostAssistsAvg.realValue <
          playersTracker[p].mostAssistsAvg.amount /
            playersTracker[p].mostAssistsAvg.appearences)
    ) {
      playerRecords.mostAssistsAvg = {
        value: (
          playersTracker[p].mostAssistsAvg.amount /
          playersTracker[p].mostAssistsAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].mostAssistsAvg.amount /
          playersTracker[p].mostAssistsAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostAssistsAvg.amount,
        app: playersTracker[p].mostAssistsAvg.appearences
      };
    }

    if (
      playersTracker[p].mostPointsAvg != undefined &&
      (playerRecords.mostPointsAvg == undefined ||
        playerRecords.mostPointsAvg.realValue <
          playersTracker[p].mostPointsAvg.amount /
            playersTracker[p].mostPointsAvg.appearences)
    ) {
      playerRecords.mostPointsAvg = {
        value: (
          playersTracker[p].mostPointsAvg.amount /
          playersTracker[p].mostPointsAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].mostPointsAvg.amount /
          playersTracker[p].mostPointsAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostPointsAvg.amount,
        app: playersTracker[p].mostPointsAvg.appearences
      };
    }

    if (
      playersTracker[p].mostSavesAvg != undefined &&
      (playerRecords.mostSavesAvg == undefined ||
        playerRecords.mostSavesAvg.realValue <
          playersTracker[p].mostSavesAvg.amount /
            playersTracker[p].mostSavesAvg.appearences)
    ) {
      playerRecords.mostSavesAvg = {
        value: (
          playersTracker[p].mostSavesAvg.amount /
          playersTracker[p].mostSavesAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].mostSavesAvg.amount /
          playersTracker[p].mostSavesAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostSavesAvg.amount,
        app: playersTracker[p].mostSavesAvg.appearences
      };
    }

    if (
      playersTracker[p].mostSavesGkAvg != undefined &&
      (playerRecords.mostSavesGkAvg == undefined ||
        playerRecords.mostSavesGkAvg.realValue <
          playersTracker[p].mostSavesGkAvg.amount /
            playersTracker[p].mostSavesGkAvg.appearences)
    ) {
      playerRecords.mostSavesGkAvg = {
        value: (
          playersTracker[p].mostSavesGkAvg.amount /
          playersTracker[p].mostSavesGkAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].mostSavesGkAvg.amount /
          playersTracker[p].mostSavesGkAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostSavesGkAvg.amount,
        app: playersTracker[p].mostSavesGkAvg.appearences
      };
    }

    if (
      playersTracker[p].mostGoalsForAvg != undefined &&
      (playerRecords.mostGoalsForAvg == undefined ||
        playerRecords.mostGoalsForAvg.realValue <
          playersTracker[p].mostGoalsForAvg.amount /
            playersTracker[p].mostGoalsForAvg.appearences)
    ) {
      playerRecords.mostGoalsForAvg = {
        value: (
          playersTracker[p].mostGoalsForAvg.amount /
          playersTracker[p].mostGoalsForAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].mostGoalsForAvg.amount /
          playersTracker[p].mostGoalsForAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostGoalsForAvg.amount,
        app: playersTracker[p].mostGoalsForAvg.appearences
      };
    }

    if (
      playersTracker[p].mostWinnerAvg != undefined &&
      (playerRecords.mostWinnerAvg == undefined ||
        playerRecords.mostWinnerAvg.realValue <
          playersTracker[p].mostWinnerAvg.amount /
            playersTracker[p].mostWinnerAvg.appearences)
    ) {
      playerRecords.mostWinnerAvg = {
        value:
          (
            (playersTracker[p].mostWinnerAvg.amount * 100) /
            playersTracker[p].mostWinnerAvg.appearences
          ).toFixed(0) + "%",
        realValue:
          playersTracker[p].mostWinnerAvg.amount /
          playersTracker[p].mostWinnerAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostWinnerAvg.amount,
        app: playersTracker[p].mostWinnerAvg.appearences
      };
    }

    if (
      playersTracker[p].mostCleansheetAvg != undefined &&
      (playerRecords.mostCleansheetAvg == undefined ||
        playerRecords.mostCleansheetAvg.realValue <
          playersTracker[p].mostCleansheetAvg.amount /
            playersTracker[p].mostCleansheetAvg.appearences)
    ) {
      playerRecords.mostCleansheetAvg = {
        value: (
          playersTracker[p].mostCleansheetAvg.amount /
          playersTracker[p].mostCleansheetAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].mostCleansheetAvg.amount /
          playersTracker[p].mostCleansheetAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostCleansheetAvg.amount,
        app: playersTracker[p].mostCleansheetAvg.appearences
      };
    }

    if (
      playersTracker[p].mostCleansheetGkAvg != undefined &&
      (playerRecords.mostCleansheetGkAvg == undefined ||
        playerRecords.mostCleansheetGkAvg.realValue <
          playersTracker[p].mostCleansheetGkAvg.amount /
            playersTracker[p].mostCleansheetGkAvg.appearences)
    ) {
      playerRecords.mostCleansheetGkAvg = {
        value: (
          playersTracker[p].mostCleansheetGkAvg.amount /
          playersTracker[p].mostCleansheetGkAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].mostCleansheetGkAvg.amount /
          playersTracker[p].mostCleansheetGkAvg.appearences,
        playerId: p,
        goals: playersTracker[p].mostCleansheetGkAvg.amount,
        app: playersTracker[p].mostCleansheetGkAvg.appearences
      };
    }

    if (
      playersTracker[p].leastGoalsAgainstAvg != undefined &&
      (playerRecords.leastGoalsAgainstAvg == undefined ||
        playerRecords.leastGoalsAgainstAvg.realValue >
          playersTracker[p].leastGoalsAgainstAvg.amount /
            playersTracker[p].leastGoalsAgainstAvg.appearences)
    ) {
      playerRecords.leastGoalsAgainstAvg = {
        value: (
          playersTracker[p].leastGoalsAgainstAvg.amount /
          playersTracker[p].leastGoalsAgainstAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].leastGoalsAgainstAvg.amount /
          playersTracker[p].leastGoalsAgainstAvg.appearences,
        playerId: p,
        goals: playersTracker[p].leastGoalsAgainstAvg.amount,
        app: playersTracker[p].leastGoalsAgainstAvg.appearences
      };
    }

    if (
      playersTracker[p].leastGoalsAgainstGkAvg != undefined &&
      (playerRecords.leastGoalsAgainstGkAvg == undefined ||
        playerRecords.leastGoalsAgainstGkAvg.realValue >
          playersTracker[p].leastGoalsAgainstGkAvg.amount /
            playersTracker[p].leastGoalsAgainstGkAvg.appearences)
    ) {
      playerRecords.leastGoalsAgainstGkAvg = {
        value: (
          playersTracker[p].leastGoalsAgainstGkAvg.amount /
          playersTracker[p].leastGoalsAgainstGkAvg.appearences
        ).toFixed(1),
        realValue:
          playersTracker[p].leastGoalsAgainstGkAvg.amount /
          playersTracker[p].leastGoalsAgainstGkAvg.appearences,
        playerId: p,
        goals: playersTracker[p].leastGoalsAgainstGkAvg.amount,
        app: playersTracker[p].leastGoalsAgainstGkAvg.appearences
      };
    }
  }

  return playerRecords;
};

const calculateMatchRecords = fixtures => {
  let matchRecord = {
    longestMatch: undefined,
    fastestMatch: undefined
  };

  for (let f in fixtures) {
    if (fixtures[f].isRemoved) continue;

    if (fixtures[f].matches) {
      for (let m in fixtures[f].matches) {
        let match = fixtures[f].matches[m];

        if (match.isRemoved || match.isOpen) continue;

        let matchTime = Math.floor(
          (match.endWhistleTime - match.startWhistleTime) / 1000
        );

        matchTime = matchTime ? matchTime : match.time;
        let parsedTime = parseSecondsToTime(matchTime);

        if (
          matchRecord.longestMatch == undefined ||
          matchRecord.longestMatch.realValue < matchTime
        ) {
          matchRecord.longestMatch = {
            fixtureId: f,
            matchId: m,
            realValue: matchTime,
            value: parsedTime.time + " " + parsedTime.unit
          };
        }

        if (
          matchRecord.fastestMatch == undefined ||
          matchRecord.fastestMatch.realValue > matchTime
        ) {
          matchRecord.fastestMatch = {
            fixtureId: f,
            matchId: m,
            realValue: matchTime,
            value: parsedTime.time + " " + parsedTime.unit
          };
        }
      }
    }
  }

  return matchRecord;
};

export const calculateRecords = (players, fixtures) => {
  let records = {
    fixturePlayerRecord: calculateFixturePlayerRecords(players, fixtures),
    playerRecords: calculatePlayerRecords(players, fixtures),
    matchRecords: calculateMatchRecords(fixtures),
    matchPlayerReacords: {},
    fixtureTeamRecords: {},
    fixtureRecords: {},
    twoPlayersRecords: {}
  };

  return records;
};
