import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image 
        source={require('../assets/logo.png')} // keep your logo
        style={styles.logo}
        resizeMode="contain"
      />

      {/* Welcome + tagline */}
      <Text style={styles.welcome}>Welcome to GiftLocker</Text>
      <Text style={styles.tagline}>
        Send thoughtful gifts in seconds — no wrapping required.
      </Text>

      {/* Buttons */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Create')}
      >
        <Text style={styles.buttonText}>MAKE AN ACCOUNT</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Follow us:</Text>
        <View style={styles.socialRow}>
          <Text style={styles.social}>Instagram</Text>
          <Text style={styles.social}>Twitter</Text>
          <Text style={styles.social}>Facebook</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffffff',
  },
  logo: {
    width: 400,
    height: 400,
    marginBottom: 20,
  },
  welcome: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ab596fff', 
  },
  tagline: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#0077cc',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    marginTop: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  social: {
    fontSize: 14,
    color: '#0077cc',
    marginHorizontal: 10,
  },
});
