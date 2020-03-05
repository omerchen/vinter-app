export const SET_FIXTURES = "SET_FIXTURES"

export const setFixtures = (fixtures) => {
    return {type: SET_FIXTURES, newFixtures: fixtures}
}