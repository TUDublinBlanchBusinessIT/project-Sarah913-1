import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useState } from 'react';
import { auth, createUserWithEmailAndPassword } from '../firebaseConfig';

export default function CreateScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Success', 'Account created!');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
      />

      <Button title="Save" onPress={handleRegister} />
    </View>
  );
}
