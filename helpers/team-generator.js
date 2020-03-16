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
