import { View, Text, Button, StyleSheet, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/logo.png')} // adjust path as needed
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to GiftLocker</Text>

      <Button 
        title="Make an Account"
        onPress={() => navigation.navigate('Create')}
      />

      <View style={{ marginTop: 20 }}>
        <Button 
          title="Login"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // optional
  },
  logo: {
    width: 300,   // adjust size
    height: 300,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
