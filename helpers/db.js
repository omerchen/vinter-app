import Axios from 'axios'

class dbCommunicator {
    url = 'https://vinter-app.firebaseio.com/'
    getPlayers = () => Axios.get(url+'players')
    setPlayers = (players) => Axios.post(url+'players', players)
}