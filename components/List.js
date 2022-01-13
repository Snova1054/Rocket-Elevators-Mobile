// import React, { Component } from 'react'
// import { Text, View, TouchableOpacity, StyleSheet } from 'react-native'

// var elevators;

// const callingAPI = async () => {
//   try {
//     let response = await fetch(
//     'https://hidden-woodland-68127.herokuapp.com/api/elevators'
//     );
//     let json = await response.json();
//     elevators = await json;
//     return json;
//   } 
//   catch (error) {
//     console.error(error);
//   }
// };

// const DATA = elevators;

// class List extends Component {
//   state = {
//     names: [
//       {
//         id: 0,
//         status: 'Ben',
//       },
//       {
//         id: 1,
//         status: 'Susan',
//       },
//       {
//         id: 2,
//         status: 'Robert',
//       },
//       {
//         id: 3,
//         status: 'Mary',
//       }
//     ]
//   }
//   //  alertItemName = (item) => {
//   //     alert(item.name)
//   //  }
//   render() {
//     return (
//       <View>
//       {
//         this.state.names.map((item, index) => (
//           <TouchableOpacity
//             key = {item.id}
//             style = {styles.container}
//           //  onPress = {() => this.alertItemName(item)}
//             >
//             <Text style = {styles.text}>
//               Elevator #{item.id}
//               {item.status}
//             </Text>
//           </TouchableOpacity>
//         ))
//       }
//       </View>
//     )
//   }
// }
// export default List

// const styles = StyleSheet.create ({
//   container: {
//     padding: 10,
//     marginTop: 3,
//     backgroundColor: '#d9f9b1',
//     alignItems: 'center',
//   },
//   text: {
//     color: '#4f603c'
//   }
// })