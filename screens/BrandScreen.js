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
