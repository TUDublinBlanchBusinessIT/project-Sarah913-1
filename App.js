import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import CreateScreen from './screens/CreateScreen';
import DetailScreen from './screens/DetailScreen';
import LoginScreen from './screens/LoginScreen';
import GiftCardsScreen from './screens/GiftCardsScreen';
import BrandScreen from './screens/BrandScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Create" component={CreateScreen} />
        <Stack.Screen name="Detail" component={DetailScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="GiftCards" component={GiftCardsScreen} />
        <Stack.Screen name="BrandScreen" component={BrandScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
