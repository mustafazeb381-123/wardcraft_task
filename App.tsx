import { View, Text } from 'react-native'
import React from 'react'
import AllCheckIns from './src/screens/AllCheckIns'
import { NativeBaseProvider } from 'native-base'

const App = () => {
  return (
    <NativeBaseProvider>

   <AllCheckIns />
    </NativeBaseProvider>
  )
}

export default App