import { SET_PLAYERS } from "../actions/players";

const initialState = null

const playersReducer = (state = initialState, action) => {
    switch(action.type)
    {
        case SET_PLAYERS:
            return action.newPlayers
        default:
            return state
    }
}

export default playersReducer;