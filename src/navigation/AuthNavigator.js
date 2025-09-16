import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
// import SignUpScreen from '../screens/auth/SignUpScreen';




import {io} from 'socket.io-client';


const Stack = createStackNavigator();

export default function AuthNavigator() {

  const socket = io('http://localhost:6666'); // Adjust the URL as needed
  console.log("Ali", socket);
socket.on('connect', () => {
  console.log('Connected to the server');
});
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      {/* <Stack.Screen name="SignUp" component={SignUpScreen} /> */}
    </Stack.Navigator>
  );
}

