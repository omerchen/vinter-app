import {Alert} from 'react-native'

let blueSign = "💙";
let orangeSign = "🧡";
let greenSign = "💚";

let parseTeam = (teamString) => {

}

let countChar = (string, countedChar) => [...string].filter(chr=>chr===countedChar).length

export default (fixtureList)=>{
  // not empty
  if (fixtureList==="") {
    Alert.alert("רשימה ריקה")
    return null
  }

  // 3 colors exists
  if (countChar(fixtureList, blueSign)!==1 ||countChar(fixtureList, orangeSign)!==1 ||countChar(fixtureList, greenSign)!==1){
    Alert.alert("נדרש לב אחד בדיוק מכל צבע")
    return null
  }

  let preParseTeams = fixtureList.split("\n\n")

  // 3 teams exists
  if (preParseTeams.length !== 3) {
    Alert.alert("נדרש 3 קבוצות בדיוק")
    return null
  }

  Alert.alert("good!")
  return null
}
