import { calculatePoints } from "./rules";
import { parseSecondsToTime } from "./time-parser";
import { EVENT_TYPE_GOAL, EVENT_TYPE_WALL } from "../constants/event-types";
import { mergeSort } from "./mergeSort";

export const calculateFixturePlayerRecords = (players, fixtures) => {
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
    if (playersTracker[p].isRemoved) continue;

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

export const calculatePenaltyGrade = (wins, loses) => {
  return (wins + 1) / (wins + loses + 2);
};

// if 2>1 => return +0, if 1>2 return -0, if 1=2 return 0
export const comparePenaltyStats = (wins1, loses1, wins2, loses2) => {
  return (
    calculatePenaltyGrade(wins2, loses2) - calculatePenaltyGrade(wins1, loses1)
  );
};

export const calculatePlayerRecords = (players, fixtures) => {
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
    mostWinnerAvg: undefined,
    mostDoubles: undefined,
    longestCleansheetTime: undefined
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
    let playerLongestCSRecord = 0;
    let playerCurrentLongestCSRecord = 0;

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

          // calculate longest cleensheet time
          if (fixtures[f].matches) {
            for (let m in fixtures[f].matches) {
              let match = fixtures[f].matches[m];

              if (
                match.isRemoved ||
                (match.homeId != pointObject.teamId &&
                  match.awayId != pointObject.teamId)
              )
                continue;

              let isHome = match.homeId == pointObject.teamId;

              let relevantEvents = mergeSort(
                fixtures[f].matches[m].events
                  ? fixtures[f].matches[m].events.filter(
                      e =>
                        !e.isRemoved &&
                        e.isHome != isHome &&
                        e.type == EVENT_TYPE_GOAL
                    )
                  : [],
                (a, b) => {
                  return a.time > b.time;
                }
              );

              let matchTime = Math.floor(
                (match.endWhistleTime - match.startWhistleTime) / 1000
              );
              if (matchTime == null || matchTime == undefined) {
                matchTime = match.time;
              }

              let lastAddedTime = 0;

              for (let r in relevantEvents) {
                playerCurrentLongestCSRecord +=
                  relevantEvents[r].time - lastAddedTime;
                if (playerCurrentLongestCSRecord > playerLongestCSRecord) {
                  playerLongestCSRecord = playerCurrentLongestCSRecord;
                }
                playerCurrentLongestCSRecord = 0;
                lastAddedTime = relevantEvents[r].time;
              }
              playerCurrentLongestCSRecord += matchTime - lastAddedTime;
            }
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

      if (fixtures[f].matches) {
        for (let m in fixtures[f].matches) {
          let match = fixtures[f].matches[m];

          if (match.isRemoved) continue;

          if (match.events) {
            if (
              match.events.filter(
                e =>
                  !e.isRemoved && e.type == EVENT_TYPE_GOAL && e.executerId == p
              ).length > 1
            ) {
              if (playersTracker[p].mostDoubles == undefined) {
                playersTracker[p].mostDoubles = {
                  value: 1
                };
              } else {
                playersTracker[p].mostDoubles.value += 1;
              }
            }
          }
        }
      }
    }

    if (playerCurrentLongestCSRecord > playerLongestCSRecord) {
      playerLongestCSRecord = playerCurrentLongestCSRecord;
    }

    if (
      playerLongestCSRecord > 0 &&
      (playerRecords.longestCleansheetTime == undefined ||
        playerRecords.longestCleansheetTime.realValue < playerLongestCSRecord)
    ) {
      let parsedTime = parseSecondsToTime(playerLongestCSRecord);
      playerRecords.longestCleansheetTime = {
        playerId: p,
        realValue: playerLongestCSRecord,
        value: parsedTime.time + " " + parsedTime.unit
      };
    }
  }

  // find the best penalty winner
  for (let p in playersTracker) {
    if (playersTracker[p].isRemoved) continue;

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
        playerId: p
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
        playerId: p
      };
    }

    if (
      playersTracker[p].mostDoubles != undefined &&
      (playerRecords.mostDoubles == undefined ||
        playerRecords.mostDoubles.value < playersTracker[p].mostDoubles.value)
    ) {
      playerRecords.mostDoubles = {
        value: playersTracker[p].mostDoubles.value,
        playerId: p
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

export const calculateMatchRecords = fixtures => {
  let matchRecord = {
    longestWin: undefined,
    fastestWin: undefined,
    mostSaves: undefined,
    mostSavesSingleTeam: undefined,
    fastestRevolution: undefined,
  };

  for (let f in fixtures) {
    if (fixtures[f].isRemoved) continue;

    if (fixtures[f].matches) {
      for (let m in fixtures[f].matches) {
        let match = fixtures[f].matches[m];

        if (
          match.isRemoved ||
          match.isOpen ||
          match.winnerId == null ||
          match.winnerId == undefined
        )
          continue;

        let matchTime = Math.floor(
          (match.endWhistleTime - match.startWhistleTime) / 1000
        );

        matchTime = matchTime ? matchTime : match.time;
        let parsedTime = parseSecondsToTime(matchTime);

        if (
          matchRecord.longestWin == undefined ||
          matchRecord.longestWin.realValue < matchTime
        ) {
          matchRecord.longestWin = {
            fixtureId: f,
            matchId: m,
            realValue: matchTime,
            value: parsedTime.time + " " + parsedTime.unit
          };
        }

        if (
          matchRecord.fastestWin == undefined ||
          matchRecord.fastestWin.realValue > matchTime
        ) {
          matchRecord.fastestWin = {
            fixtureId: f,
            matchId: m,
            realValue: matchTime,
            value: parsedTime.time + " " + parsedTime.unit
          };
        }

        if (match.events) {
          let loserIsHome = !(match.winnerId==match.homeId)
          let goals = mergeSort(match.events.filter(e=>!e.isRemoved&&e.type==EVENT_TYPE_GOAL),
          (a, b) => a.time >= b.time)
          
          if (goals.length > 0 && goals[0].isHome == loserIsHome) {
            if (
              matchRecord.fastestRevolution == undefined ||
              matchRecord.fastestRevolution.realValue > matchTime - goals[0].time
            ) {
              let parsedTime = parseSecondsToTime(matchTime - goals[0].time)
              matchRecord.fastestRevolution = {
                fixtureId: f,
                matchId: m,
                realValue: matchTime - goals[0].time,
                value: parsedTime.time + " " + parsedTime.unit
              };
            }
          }

          let savesAmount = match.events.filter(e=>!e.isRemoved&&e.type==EVENT_TYPE_WALL).length
          let savesAmountHome = match.events.filter(e=>!e.isRemoved&&e.type==EVENT_TYPE_WALL&&e.isHome).length
          let savesAmountAway = match.events.filter(e=>!e.isRemoved&&e.type==EVENT_TYPE_WALL&&!e.isHome).length

          if (savesAmount > 0) {
            if (
              matchRecord.mostSaves == undefined ||
              matchRecord.mostSaves.realValue < savesAmount
            ) {
              matchRecord.mostSaves = {
                fixtureId: f,
                matchId: m,
                realValue: savesAmount,
                value: savesAmount
              };
            }
          }

          if (savesAmountHome > 0) {
            if (
              matchRecord.mostSavesSingleTeam == undefined ||
              matchRecord.mostSavesSingleTeam.realValue < savesAmountHome
            ) {
              matchRecord.mostSavesSingleTeam = {
                fixtureId: f,
                matchId: m,
                realValue: savesAmountHome,
                value: savesAmountHome
              };
            }
          }

          if (savesAmountAway > 0) {
            if (
              matchRecord.mostSavesSingleTeam == undefined ||
              matchRecord.mostSavesSingleTeam.realValue < savesAmountAway
            ) {
              matchRecord.mostSavesSingleTeam = {
                fixtureId: f,
                matchId: m,
                realValue: savesAmountAway,
                value: savesAmountAway
              };
            }
          }
        }
      }
    }
  }

  return matchRecord;
};

export const calculateFixtureRecords = fixtures => {
  let fixturesTracker = [...fixtures];
  let fixtureRecords = {
    mostGoals: undefined,
    leastGoals: undefined,
    mostPenalties: undefined,
    biggestWin: undefined
  };

  // init tracker
  for (let f in fixturesTracker) {
    fixturesTracker[f] = {
      ...fixturesTracker[f],
      mostGoals: {
        fixtureId: f,
        value: 0
      },
      leastGoals: {
        fixtureId: f,
        value: 0
      },
      mostPenalties: undefined,
      biggestWin: undefined
    };
  }

  // calculate tracker
  for (let f in fixturesTracker) {
    if (fixturesTracker[f].isRemoved) continue;

    if (fixturesTracker[f].matches) {
      let wins = [0, 0, 0];
      for (let m in fixturesTracker[f].matches) {
        let match = fixturesTracker[f].matches[m];

        if (match.isRemoved) continue;

        if (match.winnerId != undefined && match.winnerId != null) {
          wins[match.winnerId] += 1;
        }

        let goals = match.events
          ? match.events.filter(e => !e.isRemoved && e.type == EVENT_TYPE_GOAL)
          : [];

        let homeGoals = goals.filter(e => e.isHome);
        let awayGoals = goals.filter(e => !e.isHome);
        let penalty =
          match.winnerId != null &&
          match.winnerId != undefined &&
          homeGoals.length == awayGoals.length;

        if (fixturesTracker[f].mostGoals == undefined) {
          fixturesTracker[f].mostGoals = {
            fixtureId: f,
            value: goals.length
          };
        } else {
          fixturesTracker[f].mostGoals.value += goals.length;
        }

        if (fixturesTracker[f].leastGoals == undefined) {
          fixturesTracker[f].leastGoals = {
            fixtureId: f,
            value: goals.length
          };
        } else {
          fixturesTracker[f].leastGoals.value += goals.length;
        }

        if (fixturesTracker[f].mostPenalties == undefined) {
          fixturesTracker[f].mostPenalties = {
            fixtureId: f,
            value: penalty ? 1 : 0
          };
        } else {
          fixturesTracker[f].mostPenalties.value += penalty ? 1 : 0;
        }
      }
      wins = mergeSort(wins, (a, b) => a < b);
      let difference = wins[0] - wins[1];
      if (
        difference > 0 &&
        (fixtureRecords.biggestWin == undefined ||
          fixtureRecords.biggestWin.realValue < difference)
      ) {
        fixtureRecords.biggestWin = {
          fixtureId: f,
          value: wins[2] + "-" + wins[1] + "-" + wins[0],
          realValue: difference
        };
      }
    }
  }

  // find the best
  for (let f in fixturesTracker) {
    if (fixturesTracker[f].isRemoved) continue;

    if (
      fixturesTracker[f].mostGoals != undefined &&
      (fixtureRecords.mostGoals == undefined ||
        fixtureRecords.mostGoals.value < fixturesTracker[f].mostGoals.value)
    ) {
      fixtureRecords.mostGoals = { ...fixturesTracker[f].mostGoals };
    }

    if (
      fixturesTracker[f].leastGoals != undefined &&
      (fixtureRecords.leastGoals == undefined ||
        fixtureRecords.leastGoals.value > fixturesTracker[f].leastGoals.value)
    ) {
      fixtureRecords.leastGoals = { ...fixturesTracker[f].leastGoals };
    }

    if (
      fixturesTracker[f].mostPenalties != undefined &&
      (fixtureRecords.mostPenalties == undefined ||
        fixtureRecords.mostPenalties.value <
          fixturesTracker[f].mostPenalties.value)
    ) {
      fixtureRecords.mostPenalties = { ...fixturesTracker[f].mostPenalties };
    }
  }

  return fixtureRecords;
};

export const calculateMatchPlayerRecords = (players, fixtures) => {
  let matchPlayerRecord = {
    fastestDouble: undefined,
    longestGoal: undefined,
    fastestGoal: undefined,
    mostSavesGk: undefined,
    mostSaves: undefined,
  };

  // find records
  for (let p in players) {
    if (players[p].isRemoved) continue;

    for (let f in fixtures) {
      if (fixtures[f].isRemoved) continue;

      if (fixtures[f].matches) {
        for (let m in fixtures[f].matches) {
          let match = fixtures[f].matches[m];

          if (match.isRemoved) continue;

          if (match.events) {
            let saves = match.events.filter(e=>!e.isRemoved&&e.type==EVENT_TYPE_WALL&&e.executerId==p).length

            if (saves > 0) {
              let pointsObject = calculatePoints(players,fixtures,p,f)

              if (pointsObject.appearence) {
                if (pointsObject.isGoalkeeper) {
                  if (matchPlayerRecord.mostSavesGk == undefined || matchPlayerRecord.mostSavesGk.realValue < saves) {
                    matchPlayerRecord.mostSavesGk = {
                      playerId: p,
                      fixtureId: f,
                      matchId: m,
                      realValue: saves,
                      value: saves
                    }
                  }
                } else {
                  if (matchPlayerRecord.mostSaves == undefined || matchPlayerRecord.mostSaves.realValue < saves) {
                    matchPlayerRecord.mostSaves = {
                      playerId: p,
                      fixtureId: f,
                      matchId: m,
                      realValue: saves,
                      value: saves
                    }
                  }
                }
              }
            }

            let goals = mergeSort(
              match.events.filter(
                e =>
                  !e.isRemoved && e.type == EVENT_TYPE_GOAL && e.executerId == p
              ),
              (a, b) => a.time >= b.time
            );

            if (goals.length == 0) continue;

            if (
              matchPlayerRecord.fastestGoal == undefined ||
              matchPlayerRecord.fastestGoal.realValue > goals[0].time
            ) {
              let parsedTime = parseSecondsToTime(goals[0].time);
              matchPlayerRecord.fastestGoal = {
                playerId: p,
                fixtureId: f,
                matchId: m,
                realValue: goals[0].time,
                value: parsedTime.time + " " + parsedTime.unit
              };
            }

            if (
              matchPlayerRecord.longestGoal == undefined ||
              matchPlayerRecord.longestGoal.realValue <
                goals[goals.length - 1].time
            ) {
              let parsedTime = parseSecondsToTime(goals[goals.length - 1].time);
              matchPlayerRecord.longestGoal = {
                playerId: p,
                fixtureId: f,
                matchId: m,
                realValue: goals[0].time,
                value: parsedTime.time + " " + parsedTime.unit
              };
            }

            for (let g in goals) {
              if (g == 0) continue;

              if (
                matchPlayerRecord.fastestDouble == undefined ||
                matchPlayerRecord.fastestDouble.realValue >
                  goals[g].time - goals[g - 1].time
              ) {
                let parsedTime = parseSecondsToTime(
                  goals[g].time - goals[g - 1].time
                );
                matchPlayerRecord.fastestDouble = {
                  playerId: p,
                  fixtureId: f,
                  matchId: m,
                  realValue: goals[0].time,
                  value: parsedTime.time + " " + parsedTime.unit
                };
              }
            }
          }
        }
      }
    }
  }

  return matchPlayerRecord;
};

export const calculateFixtureTeamRecords = fixtures => {
  let teamLabels = ["הכחולים", "הכתומים", "הירוקים"];

  let fixtureTeamRecords = {
    mostWinsInRow: undefined,
    mostGoalsFor: undefined,
    leastGoalsFor: undefined,
    mostGoalsAgainst: undefined,
    leastGoalsAgainst: undefined,
    mostSaves: undefined,
    mostCleansheets: undefined,
    mostWins: undefined,
    leastWins: undefined,
    mostTimeOnPitch: undefined,
    mostGoalsDifference: undefined
  };

  for (let f in fixtures) {
    if (fixtures[f].isRemoved) continue;

    for (let t in teamLabels) {
      let goalsFor = 0;
      let goalsAgainst = 0;
      let saves = 0;
      let cleansheets = 0;
      let wins = 0;
      let playTime = 0;
      let winsInRow = 0;
      let currentWinsInRow = 0;
      let matches = 0;

      if (fixtures[f].matches) {
        for (let m in fixtures[f].matches) {
          let match = fixtures[f].matches[m];

          if (match.isRemoved || (match.homeId != t && match.awayId != t))
            continue;

          let isHome = match.homeId == t;

          let matchTime = Math.floor(
            (match.endWhistleTime - match.startWhistleTime) / 1000
          );

          if (matchTime == null || matchTime == undefined) {
            matchTime = match.time;
          }

          let relevantEvents = match.events
            ? match.events.filter(e => !e.isRemoved)
            : [];

          matches += 1;
          playTime += matchTime;
          wins += match.winnerId == t ? 1 : 0;
          goalsFor += relevantEvents.filter(
            e => e.type == EVENT_TYPE_GOAL && e.isHome == isHome
          ).length;
          saves += relevantEvents.filter(
            e => e.type == EVENT_TYPE_WALL && e.isHome == isHome
          ).length;
          goalsAgainst += relevantEvents.filter(
            e => e.type == EVENT_TYPE_GOAL && e.isHome != isHome
          ).length;
          cleansheets +=
            relevantEvents.filter(
              e => e.type == EVENT_TYPE_GOAL && e.isHome != isHome
            ).length == 0
              ? 1
              : 0;

          if (match.winnerId == t) {
            currentWinsInRow += 1;
          } else {
            if (currentWinsInRow > winsInRow) winsInRow = currentWinsInRow;
            currentWinsInRow = 0;
          }
        }
      }

      if (currentWinsInRow > winsInRow) winsInRow = currentWinsInRow;

      // compare to prev records
      if (
        fixtureTeamRecords.mostCleansheets == undefined ||
        fixtureTeamRecords.mostCleansheets.value < cleansheets
      ) {
        fixtureTeamRecords.mostCleansheets = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: cleansheets
        };
      }

      if (
        fixtureTeamRecords.mostGoalsAgainst == undefined ||
        fixtureTeamRecords.mostGoalsAgainst.value < goalsAgainst
      ) {
        fixtureTeamRecords.mostGoalsAgainst = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: goalsAgainst
        };
      }

      if (
        fixtureTeamRecords.mostGoalsDifference == undefined ||
        fixtureTeamRecords.mostGoalsDifference.value < goalsFor - goalsAgainst
      ) {
        fixtureTeamRecords.mostGoalsDifference = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: goalsFor - goalsAgainst
        };
      }

      if (
        fixtureTeamRecords.mostGoalsFor == undefined ||
        fixtureTeamRecords.mostGoalsFor.value < goalsFor
      ) {
        fixtureTeamRecords.mostGoalsFor = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: goalsFor
        };
      }

      if (
        fixtureTeamRecords.mostSaves == undefined ||
        fixtureTeamRecords.mostSaves.value < saves
      ) {
        fixtureTeamRecords.mostSaves = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: saves
        };
      }

      if (
        fixtureTeamRecords.mostTimeOnPitch == undefined ||
        fixtureTeamRecords.mostTimeOnPitch.realValue < playTime
      ) {
        let parsedTime = parseSecondsToTime(playTime);
        fixtureTeamRecords.mostTimeOnPitch = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          realValue: playTime,
          value: parsedTime.time + " " + parsedTime.unit
        };
      }

      if (
        fixtureTeamRecords.mostWins == undefined ||
        fixtureTeamRecords.mostWins.value < wins
      ) {
        fixtureTeamRecords.mostWins = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: wins
        };
      }

      if (
        fixtureTeamRecords.mostWinsInRow == undefined ||
        fixtureTeamRecords.mostWinsInRow.value < winsInRow
      ) {
        fixtureTeamRecords.mostWinsInRow = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: winsInRow
        };
      }

      if (
        fixtureTeamRecords.leastGoalsAgainst == undefined ||
        fixtureTeamRecords.leastGoalsAgainst.value > goalsAgainst
      ) {
        fixtureTeamRecords.leastGoalsAgainst = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: goalsAgainst
        };
      }

      if (
        fixtureTeamRecords.leastGoalsFor == undefined ||
        fixtureTeamRecords.leastGoalsFor.value > goalsFor
      ) {
        fixtureTeamRecords.leastGoalsFor = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: goalsFor
        };
      }

      if (
        fixtureTeamRecords.leastWins == undefined ||
        fixtureTeamRecords.leastWins.value > wins
      ) {
        fixtureTeamRecords.leastWins = {
          fixtureId: f,
          teamId: t,
          teamLabel: teamLabels[t],
          value: wins
        };
      }
    }
  }

  return fixtureTeamRecords;
};

export const calculateTwoPlayersRecords = (players, fixtures) => {
  let twoPlayersRecords = {
    bestCouple: undefined,
    playedTogether: undefined,
    winTogether: undefined
  };

  // init player tracker
  let playersTracker = [];

  let innerPlayerTracker = [];

  for (let p in players) {
    innerPlayerTracker.push({
      goals: 0,
      play: 0,
      win: 0
    });
  }

  for (let p in players) {
    playersTracker.push({ ...innerPlayerTracker });
  }

  // calculate tracker
  for (let p1 in players) {
    if (players[p1].isRemoved) continue;

    for (let f in fixtures) {
      if (fixtures[f].isRemoved) continue;

      let pointsObject = calculatePoints(players, fixtures, p1, f);

      if (pointsObject.appearence) {
        let teammates = fixtures[f].playersList[pointsObject.teamId].players;
        for (let t in teammates) {
          let p2 = teammates[t].id;

          if (p1 == p2) continue;

          playersTracker[p1][p2] = {...playersTracker[p1][p2], play: playersTracker[p1][p2].play+1};
          if (pointsObject.teamWin) playersTracker[p1][p2] = {...playersTracker[p1][p2], win: playersTracker[p1][p2].win+1};;
        }

        if (fixtures[f].matches && pointsObject.goals > 0) {
          for (let m in fixtures[f].matches) {
            let match = fixtures[f].matches[m];

            if (match.isRemoved) continue;

            let goals = match.events
              ? match.events.filter(
                  e =>
                    !e.isRemoved &&
                    e.type == EVENT_TYPE_GOAL &&
                    e.executerId == p1
                )
              : [];

            for (let g in goals) {
              let p2 = goals[g].helperId;

              if (p2 == undefined || p2 == null || p1 == p2) continue;

              playersTracker[p1][p2] = {...playersTracker[p1][p2], goals: playersTracker[p1][p2].goals+1};;
            }
          }
        }
      }
    }
  }

  // find the best in any category
  for (let p1 in players) {
    for (let p2 in players) {
      if (players[p1].isRemoved || players[p2].isRemoved || p1 == p2) continue;

      if (playersTracker[p1][p2].goals>0&&(
        twoPlayersRecords.bestCouple == undefined || twoPlayersRecords.bestCouple.realValue < playersTracker[p1][p2].goals
      )){
        twoPlayersRecords.bestCouple = {
          player1Id: p1,
          player2Id: p2,
          player1Label: "כובש",
          player2Label: "מבשל",
          realValue: playersTracker[p1][p2].goals,
          value: playersTracker[p1][p2].goals+" שערים"
        }
      }

      if (playersTracker[p1][p2].play>0&&(
        twoPlayersRecords.playedTogether == undefined || twoPlayersRecords.playedTogether.realValue < playersTracker[p1][p2].play
      )){
        twoPlayersRecords.playedTogether = {
          player1Id: p1,
          player2Id: p2,
          realValue: playersTracker[p1][p2].play,
          value: playersTracker[p1][p2].play+" משחקים"
        }
      }

      if (playersTracker[p1][p2].win>0&&(
        twoPlayersRecords.winTogether == undefined || twoPlayersRecords.winTogether.realValue < playersTracker[p1][p2].win
      )){
        twoPlayersRecords.winTogether = {
          player1Id: p1,
          player2Id: p2,
          realValue: playersTracker[p1][p2].win,
          value: playersTracker[p1][p2].win+" נצחונות",
        }
      }
    }
  }

  return twoPlayersRecords;
};

export const calculateRecords = (players, fixtures) => {
  let records = {
    fixturePlayerRecord: calculateFixturePlayerRecords(players, fixtures),
    playerRecords: calculatePlayerRecords(players, fixtures),
    matchRecords: calculateMatchRecords(fixtures),
    fixtureRecords: calculateFixtureRecords(fixtures),
    matchPlayerReacords: calculateMatchPlayerRecords(players, fixtures),
    fixtureTeamRecords: calculateFixtureTeamRecords(fixtures),
    twoPlayersRecords: calculateTwoPlayersRecords(players, fixtures)
  };

  return records;
};
