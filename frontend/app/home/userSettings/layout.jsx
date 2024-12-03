import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
      <Stack.Screen name="editProfile"/>
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

       
        
    </Stack>
  )
}