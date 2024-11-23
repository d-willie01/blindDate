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
    </Stack>
  )
}