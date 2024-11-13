import { Tabs } from 'expo-router'
import React from 'react'

export default function _layout() {
  return (
    <Tabs screenOptions={{
        headerShown: false
    }}>
        <Tabs.Screen name='connect'/>
        <Tabs.Screen name='settings'/>
        
    </Tabs>
  )
}