import Axios from 'axios'
import { isDebug } from "../constants/configs"

class DBCommunicator {
    url = 'https://vinter-app.firebaseio.com/'
    playersTableName = 'players'
    fixturesTableName = isDebug?'fixturesDebug':'fixturesprepilot'
    getPlayers = () => Axios.get(this.url+this.playersTableName+'.json')
    setPlayers = (players) => Axios.put(this.url+this.playersTableName+'.json', players)
    getFixtures = () => Axios.get(this.url+this.fixturesTableName+'.json')
    setFixtures = (fixtures) => Axios.put(this.url+this.fixturesTableName+'.json', fixtures)
}

export default new DBCommunicator()