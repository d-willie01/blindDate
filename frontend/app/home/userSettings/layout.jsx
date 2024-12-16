import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen options={{
        headerShown: true
      }} name="editProfile"/>
        <Stack.Screen options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }} name= "communication/supportFeedback"/>
        <Stack.Screen options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }} name="communication/reportAbuse"/>
        <Stack.Screen name="transactions"/>

       
        
    </Stack>
  )
}