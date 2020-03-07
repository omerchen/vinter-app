import { Alert } from "react-native";

let blueSign = "💙";
let orangeSign = "🧡";
let greenSign = "💚";
let gkIdentifier = "(שוער)";


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
    if (players[i].name === playerName && !players[i].isRemoved) return players[i].id
  }

  return null
}

let parsePlayer = (playerString, isCaptain, players, handleNonExistPlayer) => {
  let parsedPlayer = {
    isCaptain: isCaptain,
    isGoalkeeper: (occurrences(playerString, gkIdentifier) ===1)
  }

  let playerName = ""

  if (parsedPlayer.isGoalkeeper) {
    let nameWithoutGkPostfixArr = playerString.split(gkIdentifier)
    
    if (nameWithoutGkPostfixArr.length !== 2 || nameWithoutGkPostfixArr[1] != "" )
    {
      Alert.alert("שם לא חוקי לאחד השוערים")
      return null
    }

    playerName = nameWithoutGkPostfixArr[0].trim()

  } else {
    playerName = playerString.trim()
  }

  let id = getPlayerId(playerName, players)

  if (id == null)
  {
    handleNonExistPlayer(playerName)
    return null
  }

  parsedPlayer.id = id

  return parsedPlayer
};

let parseTeam = (teamString, players, handleNonExistPlayer) => {
  let lines = teamString.split("\n");

  // validate number of players at a team
  if (lines.length != 6 /*num of players + header line*/) {
    Alert.alert("על כל הקבוצות להיות בפורמט של שורת כותרת ו5 שורות לשחקנים");
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
    if (i >0) {
      let parsedPlayer = parsePlayer(lines[i], i == 1, players, handleNonExistPlayer);

      if (parsedPlayer == null) return null;
  
      team.players.push(parsedPlayer);
    }
    
  }

  return team;
};


export default (fixtureList, players, handleNonExistPlayer = (playerName)=>{Alert.alert("לא נמצא שחקן בשם: "+playerName)}) => {
  // not empty
  if (fixtureList === "") {
    Alert.alert("רשימה ריקה");
    return null;
  }

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
    let currentParsedTeam = parseTeam(preParseTeams[i], players, handleNonExistPlayer);

    if (currentParsedTeam == null) {
      return null;
    } else {
      parsedList.push(currentParsedTeam);
    }
  }

  return parsedList;
};
