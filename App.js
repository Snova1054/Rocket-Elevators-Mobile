import React, {useState, useReducer, useEffect} from 'react';
import {
  SafeAreaView, StyleSheet, View, Text, FlatList, Modal, TouchableOpacity, TextInput, LogoTitle, Button, StatusBar, ImageBackground, Image, Dimensions
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

let DATA;

async function prepareData(){
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

function LoginScreen({ navigation }) {
  const [isOperationnal, setIsOperationnal] = useState(false);
  let emptyText = '';
  let text = useState('');
  var writtenEmail;

  function updateDataEmail(text) {
    writtenEmail = text.toLowerCase();
    prepareData()
  }

  const verifyEmail = async () => {
    try {
      const response = await fetch(
        `https://hidden-woodland-68127.herokuapp.com/api/users/${writtenEmail}`
      );
      const json = await response.json();
      if(json == true) {
        //Navigate to homepage
        navigation.navigate('Home')
        setTimeout(() => {
          setIsOperationnal(true)
          setIsOperationnal(false)
        }, 1000);
      }else{
        alert("Invalid Email");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <SafeAreaView  style={{backgroundColor: '#a8acaf', flex: 1, alignItems: 'center', justifyContent: 'flex-start', borderTopWidth: 20, borderTopColor: '#a8acaf'}}>
      <Image 
      source={require('./assets/RocketElevatorsLogo.png')} 
      style={{
        height: (Dimensions.get('window').width - 25)/2.75, 
        width: Dimensions.get('window').width - 25,
        resizeMode: 'stretch',}} 
      />
      <Text style={{fontSize:22}}>Identification</Text>
      <TextInput
        style={{width: 240, height: 40, margin: 12, borderWidth: 1, padding: 10,}}
        textAlign='center'
        placeholder={'Enter your Email Here'}
        placeholderTextColor="#2a2a28"
        onChangeText={text => updateDataEmail(text)}
        value={isOperationnal ? "" : text}
        editable={true}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        autoFocus={true}
        keyboardType="email-address"
      />
      <Button
        title="Log In"
        color="black"
        onPress={() => {
          verifyEmail()
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
  const[editItem, seteditItem] = useState()
  const [isOperationnal, setIsOperationnal] = useState(false);
//Pressing an Item on the FlatList, Opens Modal
  const onPressItem = (item) => {
    setisModalVisible(true);
    seteditItem(item.id)
    
  }
//Renders each Item on the FlatList
  const renderItem = ({item, index}) => {
    return(
      <TouchableOpacity
      style={styles.item}
      onPress={() => onPressItem(item)}
      >
          <ImageBackground
            source={require('./assets/RocketElevatorsLogo.png')}
            resizeMode="contain"
            style={{
              height:
              '100%'
              ,
              width:
              '100%'
              ,
              alignSelf:'center',
              // opacity: 0.6,
              position: 'absolute',
            }}
          />
        <Text style={styles.text}>Elevator #{item.id}{"\n"}Status: {item.status}{"\n"}Building type: {item.entity_type}{"\n"}Serial #{item.serial_number}
        </Text>
      </TouchableOpacity>
    )
  }
//Changes de Data of the FlatList
  const handleEditItem = (editItem) => {
    const newData = data.map(item => {
      if(item.id == editItem){
        item.status = "serviced";
        return item
      }
      return item;
    })
    setData(newData);
    setisRender(!isRender)
  }
//Set to Serviced
  const setToOperationnalAPI = async() => {
    handleEditItem(editItem)
    fetch(`https://hidden-woodland-68127.herokuapp.com/api/elevators/${editItem}/serviced`, {
      method: 'PUT',
      headers: {
      'Content-Type': 'application/json',
      },
      body: "{}",
    })
    .then(verifyOperationalAPI())
  }

  const verifyOperationalAPI = async () => {
    try {
      const response = await fetch(
        `https://hidden-woodland-68127.herokuapp.com/api/elevators/${editItem}`
      )
     .then()
      const json = await response.json();
      if(json.status == "serviced") {
        setTimeout(() => {
          console.log(json.status)
          setIsOperationnal(true)
          // removeItem(editItem)
        }, 1500);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const goBack = () => {
    setisModalVisible(false)
    seteditItem()
    removeItem(editItem)
    setIsOperationnal(false)
  }

  const removeItem = (id) => {
    let arr = data.filter(function(item) {
      return item.id !== id
    })
    setData(arr);
  }

  function checkID(data) {
    if(editItem == undefined)
    {
      return 
    }
    return data.id == editItem;
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
          <SafeAreaView style={{
            alignItems: 'flex-start', 
            // justifyContent: 'flex-start', 
            backgroundColor: '#d81b3d', 
            height: 91,
            borderLeftWidth: 20, borderLeftColor: '#d81b3d' }}
          >
            <Button
              color='white'
              title="Go Back"
              onPress={() => isOperationnal? goBack() : setisModalVisible(false)}
              />
          </SafeAreaView>
          <View style={{alignItems: 'center', justifyContent: 'center', backgroundColor: '#a8acaf', height: 150}}>
            <Image 
              source={require('./assets/RocketElevatorsLogo.png')} 
              style={{
                height: (Dimensions.get('window').width - 25)/2.75, 
                width: Dimensions.get('window').width - 25,
                resizeMode: 'stretch',}} 
            />
          </View>
          <View style={styles.modalView}>
            <Text style={styles.statusText}>
              {editItem == undefined ? '' : "Elevator # " + (data.find(checkID)).id}
            </Text>
            <Text style={styles.statusText}>
              Current Status:
            </Text>
            <Text style={{
              color: isOperationnal ? '#39ff14' : '#d81b3d',
              fontSize: 30,
              fontWeight: 'bold',
            }}>
              {editItem == undefined ? '' : isOperationnal ? 'serviced' : (data.find(checkID)).status}
            </Text>
            <TouchableOpacity
              onPress={() => isOperationnal ? goBack() : setToOperationnalAPI()}
              style={{backgroundColor:isOperationnal ? '#0b64a0' : '#d81b3d',
              paddingHorizontal: 100,
              alignItems: 'center',
              marginTop: 20,}}
            >
              <Text style={{
                marginVertical: 30,
                fontSize: 25,
                fontWeight: 'bold',
                marginLeft: 10
              }}>
                {isOperationnal ? "Go Back" : "Set to Operational"}
              </Text>
            </TouchableOpacity>
          </View>
      </Modal>
      <Button
        color='black'
        title="Log Out"
        onPress={() => navigation.navigate("Login")}
        />
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
            headerBackTitle: 'Log Out',
            headerStyle: {
              backgroundColor: '#0b64a0',
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
    flex: 1,
    backgroundColor: '#a8acaf'
  },
  item: {
    borderBottomWidth: 3,
    borderBottomColor: '#d81b3d',
    borderLeftWidth: 3,
    borderLeftColor: 'black',
    borderRightWidth: 3,
    borderRightColor: 'black',
    alignItems: 'flex-start',
    backgroundColor: 'black'
  },
  text: {
    color:'white',
    marginVertical: 30,
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 10
  },
  statusText: {
    color:'white',
    fontSize: 30,
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#a8acaf'
  },
});

export default App;