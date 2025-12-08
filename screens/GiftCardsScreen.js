import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function GiftCardsScreen() {
  const [giftcards, setGiftcards] = useState([]);
  const [username, setUsername] = useState('');

  const brands = [
    { id: '1', name: 'Amazon', image: require('../assets/image1.png') },
    { id: '2', name: 'Starbucks', image: require('../assets/image2.png') },
    { id: '3', name: 'Nike', image: require('../assets/image3.png') },
    { id: '4', name: 'Apple', image: require('../assets/image4.png') },
    { id: '5', name: 'Spotify', image: require('../assets/image5.png') },
    { id: '6', name: 'Adidas', image: require('../assets/image6.png') },
    { id: '7', name: 'Dunnes A', image: require('../assets/image7.png') },
    { id: '8', name: 'Dunnes B', image: require('../assets/image8.png') },
    { id: '9', name: 'Dunnes C', image: require('../assets/image9.png') },
  ];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setUsername(userDoc.data().username);
        }

        const giftcardsRef = collection(db, 'users', user.uid, 'giftcards');
        const snapshot = await getDocs(giftcardsRef);

        const cards = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGiftcards(cards);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    });

    return unsubscribe;
  }, []);

  const handleSendGiftcard = async (brandName) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'users', user.uid, 'giftcards'), {
        sender: user.email,
        brand: brandName,
        amount: 25,
        message: 'Happy BIRTHDAY! Have the best day',
        createdAt: serverTimestamp(),
      });

      Alert.alert('Gift card sent!', `You selected ${brandName}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.username}>Welcome, {username}</Text>

      <Text style={styles.subtitle}>Choose a Gift Card</Text>
      <FlatList
        data={brands}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={220} // card width + marginRight
        decelerationRate="fast"
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

      <View style={styles.transactionsContainer}>
        <Text style={styles.title}>Transactions</Text>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  username: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  subtitle: { fontSize: 18, marginVertical: 15, textAlign: 'center' },

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
  brandText: { fontSize: 18, fontWeight: '700', textAlign: 'center' },

  transactionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
  card: { padding: 20, borderWidth: 1, borderRadius: 10, marginBottom: 12 },
  brand: { fontSize: 20, fontWeight: 'bold' },
});
