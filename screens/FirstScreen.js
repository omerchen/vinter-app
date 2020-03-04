import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';


let FirstScreen = props => {
  return (
    <View style={styles.container}>
      <Text>This is the first screen!</Text>
      <Button title="Create Fixture" onPress={()=>{
          props.navigation.navigate("CreateFixture")
          console.log(props)
      }}/>
      <Button title="Previous Fixtures" onPress={()=>{
          props.navigation.navigate("PreviousFixtures")
          console.log(props)
      }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default FirstScreen