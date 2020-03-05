export const SET_PLAYERS = "SET_PLAYERS"

export const setPlayers = (players) => {
    return {type: SET_PLAYERS, newPlayers: players}
}