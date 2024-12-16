import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name='connect'/>
        
       
        <Stack.Screen  name = "profile"/>
        <Stack.Screen options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }} name="filters/filterFree"/>
        <Stack.Screen options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }} name="filters/filterPremium"/>

        <Stack.Screen name = "userSettings/editProfile"/>
        

        <Stack.Screen name = "coins/index"/>
    </Stack>
  )
}