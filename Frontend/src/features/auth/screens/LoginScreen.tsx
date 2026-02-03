// import React, { useState } from 'react';
// import { View, Text, StyleSheet, Button,Alert } from 'react-native';
// import { TextInput } from 'react-native-gesture-handler';
// import { STATIC_USER } from '../constants/auth';

// const LoginScreen = ({ navigation }: any) => {
//   const [email, setEmail] = useState('');
//   const [rollNo, setRollNo] = useState('');
//   const [submitted, setSubmitted] = useState(false);

//   // const handleSubmit = () => {
//   //   console.log('Login button Pressed!');
//   //   console.log('Email:', email);
//   //   console.log('Roll No:', rollNo);
//   //   setSubmitted(true);
//   // };
//   const handleSubmit = () => {
//     if (email === STATIC_USER.email && rollNo === STATIC_USER.rollNo) {
//       Alert.alert('Login Successful');
//       navigation.replace('ActivityHub');
//     } else {
//       Alert.alert('Invalid Credentials');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome SikshaSetu - Login Page</Text>

//       <View>
//         <Text>Email</Text>
//         <TextInput
//           placeholder="Enter your Student Email"
//           placeholderTextColor={'gray'}
//           style={styles.input}
//           value={email}
//           onChangeText={setEmail}
//         />
//       </View>

//       <View>
//         <Text>Student Roll No.</Text>
//         <TextInput
//           placeholder="Enter your Student Roll-No"
//           placeholderTextColor={'gray'}
//           style={styles.input}
//           value={rollNo}
//           onChangeText={setRollNo}
//         />
//       </View>

//       <Button title="Login" onPress={handleSubmit} />

//       {submitted && <Text style={styles.success}>Login Successful</Text>}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//   },
//   title: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 20,
//   },
//   input: {
//     backgroundColor: '#F8FAFC',
//     padding: 10,
//     marginVertical: 10,
//     borderRadius: 5,
//   },
//   success: {
//     marginTop: 15,
//     color: 'green',
//     fontWeight: 'bold',
//   },
// });

// export default LoginScreen;