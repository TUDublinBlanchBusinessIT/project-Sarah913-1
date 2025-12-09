import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { LinearGradient } from 'expo-linear-gradient';


export default function GiftCardsScreen({navigation}) {
  const [giftcards, setGiftcards] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [bgColors, setBgColors] = useState(['#4c669f', '#3b5998', '#192f6a']); // default gradient

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

  const handleSendGiftcard = async (brand) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, 'users', user.uid, 'giftcards'), {
        sender: user.email,
        brand: brand.name,
        amount: selectedAmount,
        message: 'Happy BIRTHDAY! Have the best day',
        createdAt: serverTimestamp(),
      });

      setBgColors(brand.colors); // change background dynamically
      Alert.alert('Gift card sent!', `You selected ${brand.name} for €${selectedAmount}`);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  // Balance checker: sum of all amounts
  const totalBalance = giftcards.reduce((sum, card) => sum + Number(card.amount || 0), 0);

  return (
    <LinearGradient colors={bgColors} style={styles.container}>
      <Text style={styles.username}>Welcome, {username}</Text>
      <Text style={styles.balance}>Your Balance: €{totalBalance}</Text>

      <Text style={styles.subtitle}>Choose a Gift Card</Text>
      <FlatList
        data={brands}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
        snapToInterval={220}
        decelerationRate="fast"
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.brandCard}
            onPress={() => handleSendGiftcard(item)}
          >
            <Image source={item.image} style={styles.brandImage} />
            <Text style={styles.brandText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      <Text style={styles.amountTitle}>Choose amount to send</Text>
      <View style={styles.amountSelector}>
        {[10, 25, 50].map((amt) => (
          <TouchableOpacity
            key={amt}
            style={[
              styles.amountButton,
              selectedAmount === amt && styles.amountButtonSelected,
            ]}
            onPress={() => setSelectedAmount(amt)}
          >
            <Text style={styles.amountText}>€{amt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate('BrandScreen', { amount: selectedAmount })}
      >
        <Text style={styles.continueText}>Continue</Text>
      </TouchableOpacity>


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
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  username: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center', color: '#fff' },
  balance: { fontSize: 18, marginBottom: 10, textAlign: 'center', color: '#fff' },
  subtitle: { fontSize: 18, marginVertical: 15, textAlign: 'center', color: '#fff' },

  amountTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color: '#fff', // matches your gradient background
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
  brandText: { fontSize: 18, fontWeight: '700', textAlign: 'center' },

  amountSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 8,
  },
  amountButton: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 10,
  },
  amountButtonSelected: {
    backgroundColor: '#FFD700',
  },
  amountText: { fontSize: 16, fontWeight: 'bold' },

  continueButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: 'center',
    marginTop: 10,
  },

  transactionsContainer: {
    flex: 3,
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  title: { fontSize: 24, marginBottom: 20, textAlign: 'center', color: '#fff' },
  card: { padding: 20, borderWidth: 1, borderRadius: 10, marginBottom: 12, backgroundColor: '#fff' },
  brand: { fontSize: 20, fontWeight: 'bold' },
});
