import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BrandScreen({ route }) {
  const { amount } = route.params;
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const brands = [ /* same array as before */ ];

  const handleSendGiftcard = async (brand) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'users', user.uid, 'giftcards'), {
        sender: user.email,
        brand: brand.name,
        amount,
        recipient,
        message,
        createdAt: serverTimestamp(),
      });

      Alert.alert('Gift card sent!', `You sent €${amount} ${brand.name} to ${recipient}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Brand</Text>
      <FlatList
        data={brands}
        horizontal
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.brandCard} onPress={() => handleSendGiftcard(item)}>
            <Image source={item.image} style={styles.brandImage} />
            <Text style={styles.brandText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <TextInput
        style={styles.input}
        placeholder="Recipient email"
        value={recipient}
        onChangeText={setRecipient}
      />
      <TextInput
        style={styles.input}
        placeholder="Personal message"
        value={message}
        onChangeText={setMessage}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  brandCard: {
    backgroundColor: '#eee',
    padding: 20,
    borderRadius: 20,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
    height: 250,
  },
  brandImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
});

