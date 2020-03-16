
export const BAD_GRADE = 1000;
export const E = 2; // default exponent
export const DE = E; // defense exponent
export const AE = E; // attack exponent
export const OE = E; // overall exponent
export const DW = 1; // defense weight
export const AW = 1; // attack weight
export const OW = 2; // overall weight

export const calculateGrade = playersArray => {
  console.log("here1");
  let defenseCount = [0, 0, 0];
  let defenseSum = [0, 0, 0];
  let attackCount = [0, 0, 0];
  let attackSum = [0, 0, 0];
  let overallCount = [0, 0, 0];
  let overallSum = [0, 0, 0];

  for (let i in playersArray) {
    if (playersArray[i].teamId != null) {
      if (playersArray[i].defenseRating != null) {
        defenseCount[playersArray[i].teamId] += 1;
        defenseSum[playersArray[i].teamId] += playersArray[i].defenseRating;
      }

      if (playersArray[i].attackRating != null) {
        attackCount[playersArray[i].teamId] += 1;
        attackSum[playersArray[i].teamId] += playersArray[i].attackRating;
      }

      if (playersArray[i].overallRating != null) {
        overallCount[playersArray[i].teamId] += 1;
        overallSum[playersArray[i].teamId] += playersArray[i].overallRating;
      }
    }
  }

  let defenseAvg = [0, 0, 0];
  let attackAvg = [0, 0, 0];
  let overallAvg = [0, 0, 0];

  for (let i in defenseAvg) {
    if (defenseCount[i] == 0 || attackCount[i] == 0 || overallCount[i] == 0) {
      return BAD_GRADE;
    }

    defenseAvg[i] = defenseSum[i] / defenseCount[i];
    attackAvg[i] = attackSum[i] / attackCount[i];
    overallAvg[i] = overallSum[i] / overallCount[i];
  }

  let defenseGrade = Math.max(...defenseAvg) - Math.min(...defenseAvg);
  let attackGrade = Math.max(...attackAvg) - Math.min(...attackAvg);
  let overallGrade = Math.max(...overallAvg) - Math.min(...overallAvg);

  return (
    OW * Math.pow(overallGrade, OE) +
    DW * Math.pow(defenseGrade, DE) +
    AW * Math.pow(attackGrade, AE)
  );
};

export const generate = playersArray => {
  let playersCounter = [0, 0, 0];
  let gkCounter = [0, 0, 0];
  let maxPlayersPerTeam = playersArray.length / 3;
  let maxGkPerTeam = 1;

  for (let i in playersArray) {
    if (playersArray[i].teamId != null) {
      playersCounter[playersArray[i].teamId] += 1;
      if (playersArray[i].isGoalkeeper) {
        gkCounter[playersArray[i].teamId] += 1;
      }
    }
  }

  let newPlayersArray = [...playersArray];

  for (let i in newPlayersArray) {
    if (newPlayersArray[i].teamId == null) {
      if (newPlayersArray[i].isGoalkeeper) {
        for (let j in gkCounter) {
          if (gkCounter[j] < maxGkPerTeam) {
            gkCounter[j] += 1;
            playersCounter[j] += 1;
            newPlayersArray[i].teamId = j;
            break;
          }
        }
      } else {
        for (let j in playersCounter) {
          if (playersCounter[j] < maxPlayersPerTeam) {
            playersCounter[j] += 1;
            newPlayersArray[i].teamId = j;
            break;
          }
        }
      }
    }
  }

  return newPlayersArray;
};
