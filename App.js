import * as React from 'react';
import {useState} from 'react';
import { Button, View, Text, TextInput, FlatList, StatusBar, SafeAreaView, TouchableOpacity, StyleSheet  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import List from './components/List'

let writtenEmail;
function setEmail(text){
  writtenEmail = text;
}

const DATA = [
  {
    id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
    title: "First Item",
  },
  {
    id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
    title: "Second Item",
  },
  {
    id: "58694a0f-3da1-471f-bd96-145571e29d72",
    title: "Third Item",
  },
];

const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>{item.title}</Text>
  </TouchableOpacity>
);

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
    <SafeAreaView  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
    </SafeAreaView >
  );
}

function HomeScreen({ navigation }) {
  return (
    <SafeAreaView  style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: StatusBar.currentHeight || 0}}>
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
    </SafeAreaView >
  );
}

function ElevatorsScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);

  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#f9c2ff";
    const color = item.id === selectedId ? 'white' : 'black';

    return (
      <Item
        item={item}
        onPress={() => setSelectedId(item.id)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  return (
    <SafeAreaView  style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        extraData={selectedId}
      />
    </SafeAreaView >
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

const styles = StyleSheet.create({
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
});

export default App;