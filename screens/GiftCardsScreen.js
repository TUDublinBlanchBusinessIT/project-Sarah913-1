import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';

export default function GiftCardsScreen() {
  const [giftcards, setGiftcards] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [brand, setBrand] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');

  // Fetch received gift cards
  useEffect(() => {
    const fetchGiftcards = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        const giftcardsRef = collection(db, "users", user.uid, "giftcards");
        const snapshot = await getDocs(giftcardsRef);

        const cards = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGiftcards(cards);
      } catch (error) {
        console.error("Error fetching giftcards:", error);
      }
    };

    fetchGiftcards();
  }, []);

  // Send a gift card
  const handleSendGiftcard = async () => {
    try {
      // Normally you'd look up recipient UID by email
      // For demo, assume recipient UID is their email string
      const recipientUid = recipient;

      await addDoc(collection(db, "users", recipientUid, "giftcards"), {
        sender: auth.currentUser.email,
        brand,
        amount,
        message,
        createdAt: new Date(),
      });

      alert("Gift card sent!");
      setRecipient('');
      setBrand('');
      setAmount('');
      setMessage('');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
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

      <Text style={styles.subtitle}>Send a Gift Card</Text>
      <TextInput placeholder="Recipient UID/Email" value={recipient} onChangeText={setRecipient} style={styles.input}/>
      <TextInput placeholder="Brand" value={brand} onChangeText={setBrand} style={styles.input}/>
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} style={styles.input}/>
      <TextInput placeholder="Message" value={message} onChangeText={setMessage} style={styles.input}/>
      <Button title="Send Gift Card" onPress={handleSendGiftcard} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, marginBottom: 20 },
  subtitle: { fontSize: 18, marginTop: 20, marginBottom: 10 },
  card: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  brand: { fontSize: 18, fontWeight: 'bold' },
  input: { borderWidth: 1, marginBottom: 10, padding: 8 },
});
