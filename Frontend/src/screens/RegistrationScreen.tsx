import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, TextInput,Alert } from 'react-native';

const RegistrationScreen = ({ navigation }: any) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // const handleSubmit = () => {
  //   console.log('registration button Pressed!');
  //   console.log('Name:', name);
  //   console.log('Email:', email);
  //   console.log('Roll No:', rollNo);
  //   setSubmitted(true);
  // };
  const handleSubmit = () => {
    if (!name || !email || !rollNo) {
      Alert.alert('Please fill all fields');
      return;
    }

    Alert.alert('Registration successful! Please login.');
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome SikshaSetu - Registration Page</Text>
      <View>
        <Text>Name</Text>
        <TextInput
          placeholder="Enter your Student Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />
      </View>

      <View>
        <Text>Email</Text>
        <TextInput
          placeholder="Enter your Student Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />
      </View>

      <View>
        <Text>Student Roll No.</Text>
        <TextInput
          placeholder="Enter your Student Roll-No"
          style={styles.input}
          value={rollNo}
          onChangeText={setRollNo}
        />
      </View>

      <Button title="Login" onPress={handleSubmit} />

      {submitted && <Text style={styles.success}>Login Successful</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#F8FAFC',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
  success: {
    marginTop: 15,
    color: 'green',
    fontWeight: 'bold',
  },
});

export default RegistrationScreen;
