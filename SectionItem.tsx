import React, { useState } from 'react'
import { Text, StyleSheet, CheckBox } from 'react-native'
import * as Animatable from 'react-native-animatable'
// import Checkbox from '@react-native-community/checkbox'

export default function SectionItem ({ item, onChecked, index }: { item: any, onChecked: Function, index: number }) {
    const [isChecked, setIsChecked] = useState(item.checked)
  
    function handleValueChange (value: Boolean) {
      isChecked ? setIsChecked(false) : setIsChecked(true)
      onChecked(isChecked)
    }
  
    return (
      <Animatable.View style={styles.sectionItem} animation="fadeIn" delay={index * 100} useNativeDriver duration={500}>
        <CheckBox value={isChecked} onValueChange={handleValueChange} tintColors={{ true: '#f6416c', false: '#2b2e4a' }}/>
        <Text style={[styles.ingredient, isChecked ? styles.isChecked : {}]}>{item.raw}</Text>
      </Animatable.View>
    )
  }

  const styles = StyleSheet.create({
      sectionItem: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginLeft: 12
      },
      ingredient: {
        color: '#1d1d1d'
      },
      isChecked: {
        textDecorationLine: 'line-through',
        color: '#888'
      }
  })