import { Alert } from "react-native";

let blueSign = "💙";
let orangeSign = "🧡";
let greenSign = "💚";
let gkIdentifier = "(שוער)";
let captainIdentifier = "(קפטן)";
const playerIdentifierInsidePrelist = ")";

const MINIMUM_PLAYERS_PER_TEAM = 3;
const MAXIMUM_PLAYERS_PER_TEAM = 7;

export let teamLabelsArray = [
  "הקבוצה הכחולה",
  "הקבוצה הכתומה",
  "הקבוצה הירוקה"
];
export let shortTeamLabelsArray = ["כחול", "כתום", "ירוק"];
let teamColorsArray = ["blue", "orange", "green"];

export let codesToTeamColor = code => {
  if (code < 0 || code >= teamColorsArray.length) return null;

  return teamColorsArray[code];
};

export let teamColorToCode = teamColor => {
  for (let i in teamColorsArray) {
    if (teamColorsArray[i] === teamColor) return i;
  }

  return null;
};

let determineColor = teamString => {
  let countBlue = occurrences(teamString, blueSign);
  let countOrange = occurrences(teamString, orangeSign);
  let countGreen = occurrences(teamString, greenSign);

  if (countBlue + countOrange + countGreen !== 1) return null;

  if (countBlue === 1) return teamColorToCode("blue");

  if (countOrange === 1) return teamColorToCode("orange");

  if (countGreen === 1) return teamColorToCode("green");

  console.log("wierd scenario just happen!");
  return null;
};

let occurrences = (string, subString, allowOverlapping = true) => {
  string += "";
  subString += "";
  if (subString.length <= 0) return string.length + 1;

  var n = 0,
    pos = 0,
    step = allowOverlapping ? 1 : subString.length;

  while (true) {
    pos = string.indexOf(subString, pos);
    if (pos >= 0) {
      ++n;
      pos += step;
    } else break;
  }
  return n;
};

let getPlayerId = (playerName, players) => {
  for (let i in players) {
    if (players[i].name === playerName && !players[i].isRemoved)
      return players[i].id;
  }

  return null;
};

let parsePlayer = (playerString, isCaptain, players, handleNonExistPlayer) => {
  let parsedPlayer = {
    isCaptain: isCaptain,
    isGoalkeeper: occurrences(playerString, gkIdentifier) === 1
  };

  let playerName = "";

  if (parsedPlayer.isGoalkeeper) {
    let nameWithoutGkPostfixArr = playerString.split(gkIdentifier);

    if (
      nameWithoutGkPostfixArr.length !== 2 ||
      nameWithoutGkPostfixArr[1] != ""
    ) {
      Alert.alert("שם לא חוקי לאחד השוערים");
      return null;
    }

    playerName = nameWithoutGkPostfixArr[0].trim();
  } else {
    playerName = playerString.trim();
  }

  let id = getPlayerId(playerName, players);

  if (id == null) {
    handleNonExistPlayer(playerName);
    return null;
  }

  parsedPlayer.id = id;

  return parsedPlayer;
};

let parseTeam = (teamString, players, handleNonExistPlayer) => {
  let lines = teamString.split("\n");

  // validate number of players at a team
  if (
    lines.length < MINIMUM_PLAYERS_PER_TEAM + 1 ||
    lines.length > MAXIMUM_PLAYERS_PER_TEAM + 1
  ) {
    Alert.alert(
      "על כל הקבוצות להיות בפורמט של שורת כותרת ולהכיל בין " +
        MINIMUM_PLAYERS_PER_TEAM +
        " ל" +
        MAXIMUM_PLAYERS_PER_TEAM +
        " שחקנים"
    );
    return null;
  }

  let team = { teamColorCode: determineColor(lines[0]), players: [] };

  // validate color
  if (team.teamColorCode == null) {
    Alert.alert("לא ניתן לקבוע את צבע אחת הקבוצות");
    return null;
  }

  // validate maximum number of gks
  if (occurrences(teamString, gkIdentifier) > 1) {
    Alert.alert("בקבוצה מסויימת יש יותר משוער אחד");
    return null;
  }

  for (let i in lines) {
    if (i > 0) {
      let parsedPlayer = parsePlayer(
        lines[i],
        i == 1,
        players,
        handleNonExistPlayer
      );

      if (parsedPlayer == null) return null;

      team.players.push(parsedPlayer);
    }
  }

  return team;
};

export const parseList = (
  fixtureList,
  players,
  handleNonExistPlayer = playerName => {
    Alert.alert("לא נמצא שחקן בשם: " + playerName);
  }
) => {
  // not empty
  if (fixtureList === "") {
    Alert.alert("רשימה ריקה");
    return null;
  }

  // remove unused captainIdentifier
  fixtureList = fixtureList.split(captainIdentifier).join("");

  // 3 colors exists
  if (
    occurrences(fixtureList, blueSign) !== 1 ||
    occurrences(fixtureList, orangeSign) !== 1 ||
    occurrences(fixtureList, greenSign) !== 1
  ) {
    Alert.alert("נדרש לב אחד בדיוק מכל צבע");
    return null;
  }

  let preParseTeams = fixtureList.split("\n\n");

  // 3 teams exists
  if (preParseTeams.length !== 3) {
    Alert.alert("נדרש 3 קבוצות בדיוק");
    return null;
  }

  let parsedList = [];

  for (let i in preParseTeams) {
    let currentParsedTeam = parseTeam(
      preParseTeams[i],
      players,
      handleNonExistPlayer
    );

    if (currentParsedTeam == null) {
      return null;
    } else {
      parsedList.push(currentParsedTeam);
    }
  }

  return parsedList.sort((a, b) => a.teamColorCode > b.teamColorCode);
};

export const reverseList = (playersList, players) => {
  let list = "";

  for (let i in playersList) {
    if (i != 0) {
      list += "\n\n";
    }
    list += "קבוצה ";

    // Add team title
    switch (teamColorsArray[playersList[i].teamColorCode]) {
      case "blue":
        list += blueSign;
        break;
      case "orange":
        list += orangeSign;
        break;
      case "green":
        list += greenSign;
        break;
      default:
        return null;
    }

    // Add players
    for (let j in playersList[i].players) {
      list += "\n";

      let playerObject = playersList[i].players[j];

      list += players[playerObject.id].name;

      if (playerObject.isCaptain) {
        list += " " + captainIdentifier;
      }

      if (playerObject.isGoalkeeper) {
        list += " " + gkIdentifier;
      }
    }
  }

  return list;
};

export const parsePlayersArrayToList = (playersArray) => {
  let teamArrays = [[],[],[]]

  for (let i in playersArray) {
    if (playersArray[i].teamId!=null) {
      teamArrays[playersArray[i].teamId].push(playersArray[i])
    }
  }

  let strList = ""

  for (let i in teamArrays) {
    if (i != 0) strList += "\n\n"

    let sign = ""

    if (i == 0) {
      sign = blueSign
    } else if (i == 1) {
      sign = orangeSign
    } else if (i == 2) {
      sign = greenSign
    }

    strList += "קבוצה "+sign+":"

    for (let j in teamArrays[i]) {
      strList += "\n"+teamArrays[i][j].name
      
      if (teamArrays[i][j].isGoalkeeper) {
        strList += " "+gkIdentifier
      }
    }
  }

  return strList
}

export const parsePreList = (fixturePreList, players) => {
  if (players == null || players == undefined) {
    Alert.alert("מאגר שחקנים ריק");
    return null;
  }

  if (fixturePreList == "") {
    Alert.alert("רשימה ריקה");
    return null;
  }

  let relevantLines = fixturePreList.split("\n").filter(line => {
    line = line
      .split(blueSign)
      .join("")
      .split(orangeSign)
      .join("")
      .split(greenSign)
      .join("")
      .split(gkIdentifier)
      .join("")
      .trim();

    if (line == "") return false;

    if (line.indexOf(playerIdentifierInsidePrelist) == -1) return false;

    let lineParts = line.split(playerIdentifierInsidePrelist);

    if (lineParts.length != 2) return false;

    let playerPotentialName = lineParts[1].trim();

    if (
      players.filter(p => !p.isRemoved && p.name == playerPotentialName)
        .length == 0
    ) {
      return false;
    }

    return true;
  });

  if (relevantLines.length == 0) {
    Alert.alert("לא אותרו שחקנים ברשימה");
    return null;
  }

  if (relevantLines.length % 3 != 0) {
    Alert.alert("מספר השחקנים לא מתחלק ב3");
    return null;
  }

  let playersArray = [];

  for (let i in relevantLines) {
    let line = relevantLines[i]
      .split(blueSign)
      .join("")
      .split(orangeSign)
      .join("")
      .split(greenSign)
      .join("")
      .split(gkIdentifier)
      .join("")
      .trim();

    let lineParts = line.split(playerIdentifierInsidePrelist);

    let playerPotentialName = lineParts[1].trim();

    let player = players.filter(
      p => !p.isRemoved && p.name == playerPotentialName
    )[0];

    let isGoalkeeper = occurrences(relevantLines[i], gkIdentifier) == 1;
    let teamId = null;
    
    if (relevantLines[i].indexOf(blueSign) != -1) {
      teamId = 0;
    } else if (relevantLines[i].indexOf(orangeSign) != -1) {
      teamId = 1;
    } else if (relevantLines[i].indexOf(greenSign) != -1) {
      teamId = 2;
    }

    playersArray.push({
      id: player.id,
      name: player.name,
      defenseRating:
        player.defenseRating == undefined ? null : player.defenseRating,
      attackRating:
        player.defenseRating == undefined ? null : player.attackRating,
      isGoalkeeper: isGoalkeeper,
      overallRating: isGoalkeeper
        ? player.defenseRating == undefined
          ? null
          : player.defenseRating
        : player.defenseRating != null &&
          player.defenseRating != undefined &&
          player.attackRating != null &&
          player.attackRating != undefined
        ? (player.defenseRating + player.attackRating) / 2
        : null,
      teamId: teamId
    });
  }


  // validate the team rules
  let gkCounter = [0,0,0]

  let playerCounter = [0,0,0]

  let gkAmount = 0

  for (let i in playersArray) {
    if (playersArray[i].teamId != null) {
      playerCounter[playersArray[i].teamId]+=1

      if (playersArray[i].isGoalkeeper) {
        gkCounter[playersArray[i].teamId]+=1
      }
    }

    if (playersArray[i].isGoalkeeper) {
      gkAmount+=1
    }
  }

  if (gkAmount > 3) {
    Alert.alert("יותר משלושה שוערים ברשימה")
    return null
  }

  for (let i in playerCounter) {
    if (playerCounter[i]>playersArray.length/3) {
      Alert.alert("יותר מדי שחקנים בקבוצה מסויימת")
      return null;
    }

    if (gkCounter[i]>1) {
      Alert.alert("יותר משוער אחד בקבוצה מסויימת")
      return null;
    }
  }

  return playersArray;
};
