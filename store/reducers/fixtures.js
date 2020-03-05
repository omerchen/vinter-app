import { SET_FIXTURES } from "../actions/fixtures";

const initialState = null

const fixturesReducer = (state = initialState, action) => {
    switch(action.type)
    {
        case SET_FIXTURES:
            return action.newFixtures
        default:
            return state
    }
}

export default fixturesReducer;