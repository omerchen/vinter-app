export const BAD_GRADE = 1000;
export const E = 2; // default exponent
export const DE = E; // defense exponent
export const AE = E; // attack exponent
export const OE = E; // overall exponent
export const DW = 1; // defense weight
export const AW = 1; // attack weight
export const OW = 2; // overall weight

export const calculateGrade = playersArray => {
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
    return generateOptimized(playersArray)
}

export const generateOptimized = playersArray => {
    let oCounter = 0
    let oSum = 0

    for (let i in playersArray) {
        if (playersArray[i].overallRating != null) {
            oCounter += 1
            oSum += playersArray[i].overallRating
        }
    }

    if (oCounter == 0) {
        return generateNaive(playersArray)
    }

    let oAvg = oSum / oCounter
    
    let newPlayersArray = playersArray.map((p,i)=>{
        return {...p, arrayIndex: i, overallRating: p.overallRating==null?oAvg:p.overallRating}
    }).filter(p=>p.teamId==null&&!p.isGoalkeeper).sort((a,b)=>a.overallRating>=b.overallRating)

    if (newPlayersArray.length < 12) return generatePerfect(playersArray)


    let minimumSeriaIndex = 0

    for (let i=1;i<newPlayersArray.length-2;i++) {
        let oldRecord = newPlayersArray[minimumSeriaIndex+2].overallRating-newPlayersArray[minimumSeriaIndex].overallRating
        let newRecord = newPlayersArray[i+2].overallRating-newPlayersArray[i].overallRating
        if (newRecord < oldRecord) {
            minimumSeriaIndex = i
        }
    }

    for (let i = 0; i < 3; i++) {
        playersArray[newPlayersArray[minimumSeriaIndex+i].arrayIndex].teamId = i
    }

    return generatePerfect(playersArray)
}

export const generatePerfect = (
    playersArray,
    minIndex = 0,
    playersCounter = [0, 0, 0],
    gkCounter = [0, 0, 0],
    first = true
  ) => {
    const maxPlayersPerTeam = playersArray.length / 3;
    const maxGkPerTeam = 1;
    let bestResult = null;
  
    if (first) {
      for (let i in playersArray) {
        if (playersArray[i].teamId != null) {
          playersCounter[playersArray[i].teamId] += 1;
          if (playersArray[i].isGoalkeeper) {
            gkCounter[playersArray[i].teamId] += 1;
          }
        }
      }
    }
  
    for (let i = minIndex; i < playersArray.length; i++) {
      if (playersArray[i].teamId == null) {
        if (playersArray[i].isGoalkeeper) {
          for (let j in gkCounter) {
            if (
              gkCounter[j] < maxGkPerTeam &&
              playersCounter[j] < maxPlayersPerTeam
            ) {
              let newPlayersArray = [...playersArray];
              newPlayersArray[i] = { ...newPlayersArray[i] };
              newPlayersArray[i].teamId = j;
              let newPlayersCounter = [...playersCounter];
              newPlayersCounter[j] += 1;
              let newGkCounter = [...gkCounter];
              newGkCounter[j] += 1;
  
              let result = generatePerfect(
                newPlayersArray,
                i + 1,
                newPlayersCounter,
                newGkCounter,
                false
              );
  
              if (result != null) {
                  if (bestResult == null) {
                    bestResult = result;
                  } else if (result.grade < bestResult.grade) {
                    bestResult = result;
                  }
                }
            }
          }
        } else {
          for (let j in playersCounter) {
            if (playersCounter[j] < maxPlayersPerTeam) {
              let newPlayersArray = [...playersArray];
              newPlayersArray[i] = { ...newPlayersArray[i] };
              newPlayersArray[i].teamId = j;
              let newPlayersCounter = [...playersCounter];
              newPlayersCounter[j] += 1;
  
              let result = generatePerfect(
                newPlayersArray,
                i + 1,
                newPlayersCounter,
                gkCounter,
                false
              );
              if (result != null) {
                if (bestResult == null) {
                  bestResult = result;
                } else if (result.grade < bestResult.grade) {
                  bestResult = result;
                }
              }
            }
          }
        }
      }
    }
  
    if (bestResult == null) {
      if (
        playersCounter.filter(pc => pc == maxPlayersPerTeam).length !=
        playersCounter.length
      )
        return null;
  
      return { array: playersArray, grade: calculateGrade(playersArray) };
    } else return bestResult;
  };

  export const generateNaive = (
    playersArray,
    minIndex = 0,
    playersCounter = [0, 0, 0],
    gkCounter = [0, 0, 0],
    first = true
  ) => {
    const maxPlayersPerTeam = playersArray.length / 3;
    const maxGkPerTeam = 1;
    let bestResult = null;
  
    if (first) {
      for (let i in playersArray) {
        if (playersArray[i].teamId != null) {
          playersCounter[playersArray[i].teamId] += 1;
          if (playersArray[i].isGoalkeeper) {
            gkCounter[playersArray[i].teamId] += 1;
          }
        }
      }
    }
  
    for (let i = minIndex; i < playersArray.length; i++) {
      if (playersArray[i].teamId == null) {
        if (playersArray[i].isGoalkeeper) {
          for (let j in gkCounter) {
            if (
              gkCounter[j] < maxGkPerTeam &&
              playersCounter[j] < maxPlayersPerTeam
            ) {
              let newPlayersArray = [...playersArray];
              newPlayersArray[i] = { ...newPlayersArray[i] };
              newPlayersArray[i].teamId = j;
              let newPlayersCounter = [...playersCounter];
              newPlayersCounter[j] += 1;
              let newGkCounter = [...gkCounter];
              newGkCounter[j] += 1;
  
              return generateNaive(
                newPlayersArray,
                i + 1,
                newPlayersCounter,
                newGkCounter,
                false
              );
            }
          }
        } else {
          for (let j in playersCounter) {
            if (playersCounter[j] < maxPlayersPerTeam) {
              let newPlayersArray = [...playersArray];
              newPlayersArray[i] = { ...newPlayersArray[i] };
              newPlayersArray[i].teamId = j;
              let newPlayersCounter = [...playersCounter];
              newPlayersCounter[j] += 1;
  
              return generateNaive(
                newPlayersArray,
                i + 1,
                newPlayersCounter,
                gkCounter,
                false
              );
            }
          }
        }
      }
    }
  
    if (bestResult == null) {
      if (
        playersCounter.filter(pc => pc == maxPlayersPerTeam).length !=
        playersCounter.length
      )
        return null;
  
      return { array: playersArray, grade: calculateGrade(playersArray) };
    } else return bestResult;
  };
  