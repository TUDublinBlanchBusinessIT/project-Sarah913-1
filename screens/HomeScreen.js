import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
        <View style={styles.container}>
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
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
