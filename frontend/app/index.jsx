import { View, Text, Button } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function index() {
  return (
    <View style={{
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    }}>
      <Text>Welcome</Text>
      <Link href='/home/(tabs)'>
      <Button title="CLICK ME"/>
      </Link>
    </View>
  )
}