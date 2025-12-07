import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // if using Expo

export default function HomeScreen({ navigation }) {
  return (
    <LinearGradient 
      colors={['#fdfbfb', '#ebedee']} 
      style={styles.container}
    >
      {/* Logo */}
      <Image 
        source={require('../assets/logo.png')} 
        style={styles.logo}
        resizeMode="contain"
      />

      <Text style={styles.title}>Welcome to GiftLocker 🎁</Text>
      <Text style={styles.subtitle}>Your personal space for gifting made simple</Text>

      {/* Buttons */}
      <TouchableOpacity 
        style={styles.primaryButton} 
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.buttonText}>Make an Account</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.secondaryButton} 
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  primaryButton: {
    backgroundColor: '#ff6f61',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    marginBottom: 15,
    elevation: 3, // shadow for Android
  },
  secondaryButton: {
    backgroundColor: '#4a90e2',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
