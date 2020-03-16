import Axios from 'axios'
import { isDebug } from "../constants/configs"

class DBCommunicator {
    url = 'https://vinter-app.firebaseio.com/'
    playersTableName = 'players'
    fixturesTableName = isDebug?'fixturesDebug':'fixturesprepilot'
    visitsTableName = isDebug?'visitsDebug':'visits'

    getPlayers = () => Axios.get(this.url+this.playersTableName+'.json')
    setPlayers = (players) => Axios.put(this.url+this.playersTableName+'.json', players)

    getVisits = () => Axios.get(this.url+this.visitsTableName+'.json')
    setVisits = (visits) => Axios.put(this.url+this.visitsTableName+'.json', visits)

    getFixtures = () => Axios.get(this.url+this.fixturesTableName+'.json')
    setFixtures = (fixtures) => Axios.put(this.url+this.fixturesTableName+'.json', fixtures)

    getFixture = (fixtureId) => Axios.get(this.url+this.fixturesTableName+'/'+fixtureId+'.json')
    
    getMatch = (fixtureId, matchId) => Axios.get(this.url+this.fixturesTableName+'/'+fixtureId+'/matches/'+matchId+'.json')
}

export default new DBCommunicator()