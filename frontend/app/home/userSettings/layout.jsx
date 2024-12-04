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
        }} name= "reportAbuse"/>
        <Stack.Screen options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }} name="supportFeedback"/>
        <Stack.Screen name="transactions"/>

       
        
    </Stack>
  )
}