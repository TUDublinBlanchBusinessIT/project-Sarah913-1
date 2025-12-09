import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BrandScreen({ route }) {
  const { amount } = route.params;
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');

  const brands = [
    { id: '1', name: 'Amazon', image: require('../assets/image1.png') },
    { id: '2', name: 'Spotify', image: require('../assets/image2.png') },
    { id: '3', name: 'Apple', image: require('../assets/image3.png') },
    { id: '4', name: 'Nike', image: require('../assets/image4.png') },
    { id: '5', name: 'Starbucks', image: require('../assets/image5.png') },
    { id: '6', name: 'Adidas', image: require('../assets/image6.png') },
    { id: '7', name: 'Dunnes', image: require('../assets/image7.png') },
    { id: '8', name: 'Vue', image: require('../assets/image8.png') },
    { id: '9', name: 'PlayStation', image: require('../assets/image9.png') },
  ];

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
        numColumns={2}   // 👈 grid layout: 2 columns
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.brandCard} onPress={() => handleSendGiftcard(item)}>
            <Image source={item.image} style={styles.brandImage} />
            <Text style={styles.brandText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        columnWrapperStyle={{ justifyContent: 'space-between' }} // spacing between columns
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
    alignItems: 'center',
    justifyContent: 'center',
    width: '48%',   // 👈 makes two cards fit per row
    marginBottom: 15,
  },
  brandImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  brandText: {
    fontSize: 16,
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
