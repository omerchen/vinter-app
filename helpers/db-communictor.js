import Axios from 'axios'

class DBCommunicator {
    isDebug = true // TODO: use this flag for switching between databases
    url = 'https://vinter-app.firebaseio.com/'
    getPlayers = () => Axios.get(this.url+'players.json')
    setPlayers = (players) => Axios.put(this.url+'players.json', players)
    getFixtures = () => Axios.get(this.url+'fixtures.json')
    setFixtures = (fixtures) => Axios.put(this.url+'fixtures.json', fixtures)
}

export default new DBCommunicator()