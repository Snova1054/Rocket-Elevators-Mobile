import * as React from 'react';
import { Button, View, Text, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import List from './components/List'

let writtenEmail;
function setEmail(text){
  writtenEmail = text;
}

const callingAPI = async () => {
    try {
      let response = await fetch(
      `https://hidden-woodland-68127.herokuapp.com/api/users/${writtenEmail}`
      );
      let json = await response.json();
      return json;
    } catch (error) {
       console.error(error);
    }
  };



function LoginScreen({ navigation }) {
  const onLoginPress = async () => {
    let helloPeople = await callingAPI();
    helloPeople == true ? navigation.navigate('Home') : navigation.navigate('Login') + alert("Invalid Email");
  }


  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Enter your Email</Text>
      <TextInput
        placeholder='E-mail'
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setEmail(text)}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button
        title="Log In"
        onPress={() => {
          onLoginPress()
          /* 1. Navigate to the Elevators route with params */
        }}
      />
    </View>
  );
}

function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Elevators"
        onPress={() => {
          /* 1. Navigate to the Elevators route with params */
          navigation.navigate('Elevators', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
      />
    </View>
  );
}

function ElevatorsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Elevators Screen</Text>
      <Text>itemId: 86</Text>
      <Text>otherParam: 'anything you want here'</Text>
      <Button
        title="Go to Elevators... again(open another one)"
        onPress={() =>
          navigation.push('Elevators', {
            itemId: Math.floor(Math.random() * 100),
          })
        }
      />
      <Button
        title="Go to Elevators... again(refresh)"
        onPress={() => navigation.navigate('Elevators')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
      />
      <List />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            title: 'Log In',
            headerStyle: {
              backgroundColor: '#d81b3d',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Home',
            headerStyle: {
              backgroundColor: '#d81b3d',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="Elevators"
          component={ElevatorsScreen}
          options={{
            title: 'Elevators',
            headerStyle: {
              backgroundColor: '#d81b3d',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;