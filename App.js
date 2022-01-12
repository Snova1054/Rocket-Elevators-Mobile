import * as React from 'react';
import {useState} from 'react';
import { Button, View, Text, TextInput, FlatList, StatusBar, SafeAreaView, TouchableOpacity, StyleSheet  } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import List from './components/List'

let writtenEmail;
async function refreshData(){
  DATA = await callingElevatorsAPI();
}
async function setEmail(text){
  writtenEmail = text;
  await refreshData();
}

const callingElevatorsAPI = async () => {
  try {
    let response = await fetch(
    `https://hidden-woodland-68127.herokuapp.com/api/elevators/notoperational/all`
    );
    let json = await response.json();
    return json;
  } catch (error) {
      console.log(error);
  }
};


let DATA;


const Item = ({ item, onPress, backgroundColor, textColor }) => (
  <TouchableOpacity onPress={onPress} style={[styles.item, backgroundColor]}>
    <Text style={[styles.title, textColor]}>Elevator ID#{item.id}{"\n"}Serial #{item.serial_number}</Text>
  </TouchableOpacity>
);

const callingEmailAPI = async () => {
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
let answer;
const putOperationalAPI = async (id) => {
  try {
    let response = await fetch(`https://hidden-woodland-68127.herokuapp.com/api/elevators/${id}/running`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      },
      body: "{}",
  });
  } catch (error) {
      console.error(error);
  }
  new Promise(resolve => {
    setTimeout(() => resolve(temporaryName(id)), 1000);
  });
  new Promise(resolve => {
    setTimeout(() => resolve(refreshData()), 1100);
  });
  setTimeout(() => {
    console.log(DATA[0].status)
  }, 3000);
  // let response = await temporaryName(id)
  // setTimeout(() => {
  
  // }, 3000);
}

const temporaryName = async(id) => {
    try {
    let response = await fetch(
    `https://hidden-woodland-68127.herokuapp.com/api/elevators/${id}`
    );
    let json = await response.json();
    answer = await json.status;
    return json;
  } catch (error) {
      console.error(error);
  }
}

//setTimeout(() => {
// yourFunction();
// }, 3000);


function LoginScreen({ navigation }) {
//Wake up the API
  fetch(`https://hidden-woodland-68127.herokuapp.com/api/users`);

  const onLoginPress = async () => {
    let helloPeople = await callingEmailAPI();
    if(helloPeople)
    {
      navigation.navigate('Home');
      // DATA = await callingElevatorsAPI();
    }
    else
    {
      navigation.navigate('Login');
      alert("Invalid Email");
    }
    // helloPeople == true ? navigation.navigate('Home') && (DATA = await callingElevatorsAPI()) && console.log("DATA") : navigation.navigate('Login') && alert("Invalid Email");
  }


  return (
    <SafeAreaView  style={{backgroundColor: '#7d8085', flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Enter your Email</Text>
      <TextInput
        style={{width: 190, height: 40, margin: 12, borderWidth: 1, padding: 10,}}
        textAlign='center'
        value="nicolas.genest@codeboxx.biz"
      />
      <TextInput
        // style={{height: 40, margin: 12, borderWidth: 1, padding: 10,}}
        style={{width: 160, height: 40, margin: 12, borderWidth: 1, padding: 10,}}
        textAlign='center'
        placeholder={'Enter your Email Here'}
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setEmail(text)}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Button
        title="Log In"
        onPress={() => {
          onLoginPress(), setEmail()
          /* 1. Navigate to the Elevators route with params */
        }}
      />
    </SafeAreaView >
  );
}

function HomeScreen({ navigation }) {
  const [selectedId, setSelectedId] = useState(null);
  
  const renderItem = ({ item }) => {
    const backgroundColor = item.id === selectedId ? "#6e3b6e" : "#d81b3d";
    const color = item.id === selectedId ? 'white' : 'black';
    // const navigate = item.id === selectedId ? navigation.navigate("Elevator", { item }) : navigation.navigate("Home");

    return (
      <Item
        item={item}
        onPress={() => onPressItem(item)}
        backgroundColor={{ backgroundColor }}
        textColor={{ color }}
      />
    );
  };

  const onPressItem = (item) => {
    if(item != null)
    {
      navigation.navigate("Elevator", {id: item.id, entity_type: item.entity_type, serial_number: item.serial_number, status: item.status});
    }
  };
  
  return (
    <SafeAreaView  style={{backgroundColor: '#7d8085', flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: StatusBar.currentHeight || 0}}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Elevator"
        onPress={() => {
          /* 1. Navigate to the Elevators route with params */
          navigation.navigate('Elevator', {
            itemId: 86,
            otherParam: 'anything you want here',
          });
        }}
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

function ElevatorScreen({ navigation, route }) {

  
  return (
    <SafeAreaView  style={{backgroundColor: '#7d8085', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Elevators Screen</Text>
      <Text style={styles.title}>Elevator #{route.params.id}</Text>
      <Text style={styles.title}>Serial number #{route.params.serial_number}</Text>
      <Text style={styles.title}>Entity Type: {route.params.entity_type}</Text>
      <Text style={styles.title}>Status: {route.params.status}</Text>
      <Button
        title="Activate Elevator"
        onPress={() => putOperationalAPI(route.params.id)}
        color="#d81b3d"
      >
      </Button>
      <Button
        title="Go to Elevator... again(open another one)"
        onPress={() =>
          navigation.push("Elevator", {id: route.params.id, entity_type: route.params.entity_type, serial_number: route.params.serial_number, status: route.params.status})
        }
      />
      <Button
        title="Go to Elevator... again(refresh)"
        onPress={() => navigation.navigate("Elevator", {id: route.params.id, entity_type: route.params.entity_type, serial_number: route.params.serial_number, status: route.params.status})}
      />
      <Button title="Go to Home" onPress={() => navigation.push('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <Button
        title="Go back to first screen in stack"
        onPress={() => navigation.popToTop()}
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
          name="Elevator"
          component={ElevatorScreen}
          options={{
            title: 'Elevator',
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
    alignItems: "center",
    justifyContent: "center"
  },
});

export default App;