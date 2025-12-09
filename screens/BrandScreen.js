import React, { useState, useRef, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, TextInput, StyleSheet, Alert, Animated } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function BrandScreen({ route }) {
  const { amount } = route.params;
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const brands = [
    { id: '1', name: 'Amazon', image: require('../assets/image1.png'), colors: ['#080808ff', '#bea644ff'] },
    { id: '2', name: 'Spotify', image: require('../assets/image2.png'), colors: ['#1DB954', '#1ED760'] },
    { id: '3', name: 'Apple', image: require('../assets/image3.png'), colors: ['#a86262ff', '#b04a4aff'] },
    { id: '4', name: 'Nike', image: require('../assets/image4.png'), colors: ['#d98320ff', '#d15711ff'] },
    { id: '5', name: 'Starbucks', image: require('../assets/image5.png'), colors: ['#00704A', '#00A86B'] },
    { id: '6', name: 'Adidas', image: require('../assets/image6.png'), colors: ['#000000', '#666666'] },
    { id: '7', name: 'Dunnes', image: require('../assets/image7.png'), colors: ['#2C3E50', '#BDC3C7'] },
    { id: '8', name: 'Vue', image: require('../assets/image8.png'), colors: ['#1c1b1aff', '#bcb311ff'] },
    { id: '9', name: 'PlayStation', image: require('../assets/image9.png'), colors: ['#003791', '#0070D1'] },
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

      // Set confirmation with brand styling
      setConfirmation({
        brand: brand.name,
        recipient,
        message,
        amount,
        colors: brand.colors,
        image: brand.image,
      });

      // Reset animation values
      fadeAnim.setValue(0);
      slideAnim.setValue(30);

      // Run animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      // Clear inputs
      setRecipient('');
      setMessage('');

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
        numColumns={2}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.brandCard} onPress={() => handleSendGiftcard(item)}>
            <Image source={item.image} style={styles.brandImage} />
            <Text style={styles.brandText}>{item.name}</Text>
          </TouchableOpacity>
        )}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
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

      {/* Confirmation box with animation */}
      {confirmation && (
        <Animated.View
          style={[
            styles.confirmationBox,
            { backgroundColor: confirmation.colors[0], opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Image source={confirmation.image} style={styles.confirmationLogo} />
          <Text style={styles.confirmationText}>🎁 Card sent to {confirmation.recipient}</Text>
          <Text style={styles.confirmationText}>{confirmation.brand} (€{confirmation.amount})</Text>
          <Text style={styles.confirmationText}>✨ {confirmation.message}</Text>
        </Animated.View>
      )}
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
    width: '48%',
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
  confirmationBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmationLogo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  confirmationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
    textAlign: 'center',
  },
});
