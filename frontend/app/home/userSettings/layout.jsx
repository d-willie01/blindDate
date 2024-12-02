import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name="editProfile"/>
        <Stack.Screen name="reportAbuse"/>
        <Stack.Screen name="supportFeedback"/>
       
        
    </Stack>
  )
}