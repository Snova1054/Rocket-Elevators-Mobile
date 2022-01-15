import React, {useState, useReducer, useEffect} from 'react';
import {
  SafeAreaView, StyleSheet, View, Text, FlatList, Modal, TouchableOpacity, TextInput, LogoTitle, Button, StatusBar
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import axios from 'axios';


let DATA;

async function refreshData(){
  DATA = await callingElevatorsAPI();
}
async function setEmail(text){
  DATA = await callingElevatorsAPI();
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

function temporaryName(id){
  fetch(`https://hidden-woodland-68127.herokuapp.com/api/elevators/1`)
  .then(response => console.log(response.json()))
  .catch(error=>console.log(error)) //to catch the errors if any
}
// const temporaryName = async(id) => {
//     try {
//     let response = await fetch(
//     `https://hidden-woodland-68127.herokuapp.com/api/elevators/${id}`
//     );
//     let json = await response.json();
//     return await json.status;
//   } catch (error) {
//       console.error(error);
//   }
// }

function LoginScreen({ navigation }) {
//Wake up the API
  fetch(`https://hidden-woodland-68127.herokuapp.com/api/users`);

  const onLoginPress = async () => {
    navigation.navigate('Home');
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
  const[data, setData] = useState(DATA)
  const[isRender, setisRender] = useState(false)
  const[isModalVisible, setisModalVisible] = useState(false)
  const[inputText, setinputText] = useState()
  const[editItem, seteditItem] = useState()

//Pressing an Item on the FlatList, Opens Modal
  const onPressItem = (item) => {
    setisModalVisible(true);
    setinputText(item.status)
    seteditItem(item.id)
  }
//Renders each Item on the FlatList
  const renderItem = ({item, index}) => {
    return(
      <TouchableOpacity
      style={styles.item}
      onPress={() => onPressItem(item)}
      >
        <Text style={styles.text}>Elevator #{item.id}{"\n"}Status: {item.status}{"\n"}Building type: {item.entity_type}{"\n"}Serial #{item.serial_number}
        </Text>
      </TouchableOpacity>
    )
  }
//Changes de Data of the FlatList
  const handleEditItem = (editItem) => {
    const newData = data.map(item => {
      if(item.id == editItem){
        item.status = inputText;
        return item
      }
      return item;
    })
    setData(newData);
    setisRender(!isRender)
  }
//Writing on InputText in Modal
  const hello = async(text) => {
    setinputText(text)
  }
//Pressing Save Button
  const onPressSaveEdit = async() => {
    handleEditItem(editItem)
    let response = await fetch(
    `https://hidden-woodland-68127.herokuapp.com/api/elevators/${editItem}` //Text in the InputText
    );
    let json = await response.json();
    alert(`you changed the elevator from ${json.status} to ${inputText}`)
    setTimeout(() => {
      setisModalVisible(false)
    }, 3000);
  }

  return(
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        extraData={isRender}
      />
      <Modal
        animationType='fade'
        visible={isModalVisible}
        onRequestClose={() => setisModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.text}>
              Change Status:
            </Text>
            <TextInput
            style={styles.textInput}
            onChangeText={(text) => hello(text)}
            defaultValue={inputText}
            editable={true}
            multiline={false}
            maxLength={200}
            >
            </TextInput>
            <TouchableOpacity
            onPress={() => onPressSaveEdit()}
            style={styles.touchableSave}
            >
            <Text style={styles.text}>Save</Text>
            </TouchableOpacity>
          </View>
      </Modal>
    </SafeAreaView>
  )
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  container:{
    flex: 1
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    alignItems: 'flex-start',
    backgroundColor: '#d81b3d'
  },
  text: {
    marginVertical: 30,
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 10
  },
  textInput: {
    width: '90%',
    height: '70',
    borderColor: 'grey',
    borderWidth: 1,
    fontSize: 25,
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  touchableSave: {
    backgroundColor: 'orange',
    paddingHorizontal: 100,
    alignItems: 'center',
    marginTop: 20,
  }
});

export default App;