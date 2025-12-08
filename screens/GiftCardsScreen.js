import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';

export default function GiftCardsScreen() {
  const [giftcards, setGiftcards] = useState([]);
  const [username, setUsername] = useState('');

  // Example brand options with images
  const brands = [
    { id: '1', name: 'Amazon', image: require('../assets/image1.png') },
    { id: '2', name: 'Starbucks', image: require('../assets/image2.png') },
    { id: '3', name: 'Nike', image: require('../assets/image3.png') },
    { id: '4', name: 'Apple', image: require('../assets/image4.png') },
    { id: '5', name: 'Spotify', image: require('../assets/image5.png') },
  ];

  // Fetch username + giftcards
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // 🔹 Fetch username from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }

        // 🔹 Fetch giftcards
        const giftcardsRef = collection(db, "users", user.uid, "giftcards");
        const snapshot = await getDocs(giftcardsRef);

        const cards = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGiftcards(cards);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Send a gift card (brand selected)
  const handleSendGiftcard = async (brandName) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      // For demo, sending to self (replace with recipient lookup logic)
      await addDoc(collection(db, "users", user.uid, "giftcards"), {
        sender: user.email,
        brand: brandName,
        amount: 25, // fixed demo amount
        message: `Enjoy your ${brandName} gift card!`,
        createdAt: new Date(),
      });

      Alert.alert("Gift card sent!", `You selected ${brandName}`);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* 🔹 Username displayed at the top */}
      <Text style={styles.username}>Welcome, {username}</Text>

      <Text style={styles.title}>My Gift Cards</Text>
      <FlatList
        data={giftcards}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.brand}>{item.brand}</Text>
            <Text>Amount: €{item.amount}</Text>
            <Text>From: {item.sender}</Text>
            {item.message && <Text>Message: {item.message}</Text>}
          </View>
        )}
      />

      <Text style={styles.subtitle}>Select a Brand</Text>
      <FlatList
        data={brands}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.brandCard}
            onPress={() => handleSendGiftcard(item.name)}
          >
            <Image source={item.image} style={styles.brandImage} />
            <Text style={styles.brandText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  username: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10, textAlign: 'center' },
  card: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  brand: { fontSize: 18, fontWeight: 'bold' },
  brandCard: {
    backgroundColor: '#eee',
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 120,
  },
  brandImage: { width: 80, height: 80, resizeMode: 'contain', marginBottom: 5 },
  brandText: { fontSize: 14, fontWeight: '600', textAlign: 'center' },
});
