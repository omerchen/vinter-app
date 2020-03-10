import Axios from 'axios'

class DBCommunicator {
    isDebug = true // TODO: use this flag for switching between databases
    url = 'https://vinter-app.firebaseio.com/'
    playersTableName = 'players'
    fixturesTableName = 'fixturesprepilot'
    getPlayers = () => Axios.get(this.url+this.playersTableName+'.json')
    setPlayers = (players) => Axios.put(this.url+this.playersTableName+'.json', players)
    getFixtures = () => Axios.get(this.url+this.fixturesTableName+'.json')
    setFixtures = (fixtures) => Axios.put(this.url+this.fixturesTableName+'.json', fixtures)
}

export default new DBCommunicator()