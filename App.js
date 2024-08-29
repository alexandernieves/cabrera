import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './screens/Login';
import Signup from './screens/Signup';
import welcome from './screens/welcome';
import Home from './screens/Home';
import Chat from './screens/Chat';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="welcome">
        <Stack.Screen name="welcome" component={welcome}
         options={{ headerShown: false }} 
        />
        <Stack.Screen name="Login" component={Login} 
         options={{ headerShown: false }} 
        />
        <Stack.Screen name="Signup" component={Signup} 
         options={{ headerShown: false }} 
        />
        <Stack.Screen name="Home" component={Home} 
        />
        <Stack.Screen name="Chat" component={Chat} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
