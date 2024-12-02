import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name='home'/>
        <Stack.Screen options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }} name="/auth/index"/>
        
        
    </Stack>
  )
}