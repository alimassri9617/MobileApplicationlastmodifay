import React, { useState } from "react";
import {Text,View} from 'react-native';
import { useAuthStore } from '../../store/AuthStore';
import axios from "axios";
import Constants from 'expo-constants';
export const firstname =()=>{
    const firstname=useAuthStore((s)=>s.authUser?.firstName);
    const lastname=useAuthStore((s)=>s.authUser?.lastName);

    const res =  fetch(`${Constants.expoConfig.extra.API_BASE_URL}/api/notes/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const [note,setnote]=useState(null);
      setnote(res.then((ss)))
    return(
        <View>
            <Text></Text>
            <Text>First Name: {firstname}</Text>
            <Text>Last Name: {lastname}</Text>
        </View>
    )
}

//localhost:3000/api/notes/