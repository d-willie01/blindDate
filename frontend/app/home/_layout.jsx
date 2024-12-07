import { Stack } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Stack screenOptions={{
        headerShown: false
    }}>
        <Stack.Screen name='connect'/>
        <Stack.Screen name = "registration"/>
        <Stack.Screen name = "preferances"/>
        <Stack.Screen  name = "profile"/>
        <Stack.Screen options={{
          presentation: 'transparentModal',
          animation: 'fade',
          headerShown: false,
        }} name="filter"/>
        <Stack.Screen name = "userSettings"/>
        <Stack.Screen name = "coins"/>
    </Stack>
  )
}