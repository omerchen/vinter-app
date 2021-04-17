import Axios from "axios";
import { isDebug } from "../constants/configs";

class DBCommunicator {
  url = "https://vinter-app.firebaseio.com/";
  backupUrl = "https://vinter-app-back-up.firebaseio.com/";
  playersTableName = "players";
  fixturesTableName = isDebug ? "fixturesDebug" : "fixtures2021_official";
  visitsTableName = isDebug ? "visitsDebug" : "visits";

  getPlayers = () => {
    return Axios.get(this.url + this.playersTableName + ".json");
  };
  setPlayers = players => {
    Axios.put(this.backupUrl + this.playersTableName + ".json", players).then(
      res => {
        if (res.status != 200) {
          console.log("backup failed..");
        }
      }
    );
    return Axios.put(this.url + this.playersTableName + ".json", players);
  };

  getVisits = () => {
    return Axios.get(this.url + this.visitsTableName + ".json");
  };
  setVisits = visits => {
    Axios.put(this.backupUrl + this.visitsTableName + ".json", visits).then(
      res => {
        if (res.status != 200) {
          console.log("backup failed..");
        }
      }
    );
    return Axios.put(this.url + this.visitsTableName + ".json", visits);
  };

  getFixtures = () => {
    return Axios.get(this.url + this.fixturesTableName + ".json");
  };

  setFixtures = fixtures => {
    Axios.put(this.backupUrl + this.fixturesTableName + ".json", fixtures).then(
      res => {
        if (res.status != 200) {
          console.log("backup failed..");
        }
      }
    );
    return Axios.put(this.url + this.fixturesTableName + ".json", fixtures);
  };

  getFixture = fixtureId => {
    return Axios.get(
      this.url + this.fixturesTableName + "/" + fixtureId + ".json"
    );
  };

  getMatch = (fixtureId, matchId) => {
    return Axios.get(
      this.url +
        this.fixturesTableName +
        "/" +
        fixtureId +
        "/matches/" +
        matchId +
        ".json"
    );
  };
}

export default new DBCommunicator();
