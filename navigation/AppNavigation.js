import { createAppContainer } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack';

import FirstScreen from  '../screens/FirstScreen'
import CreateFixtureScreen from  '../screens/CreateFixtureScreen'
import PreviousFixturesScreen from  '../screens/PreviousFixturesScreen'

const MainNavigator = createStackNavigator({
    First: FirstScreen,
    CreateFixture: CreateFixtureScreen,
    PreviousFixtures: PreviousFixturesScreen
});

export default createAppContainer(MainNavigator)