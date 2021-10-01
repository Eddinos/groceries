import React from 'react'
import { Text, TouchableHighlight, Image, StyleSheet, View } from 'react-native'

export default function SectionTitle ({ title, onDelete }: { title: string, onDelete: () => void }) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }} >
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableHighlight onPress={onDelete} underlayColor="transparent">
          <Image source={require("../assets/delete.png")} style={{ width: 24, height: 24 }} />
        </TouchableHighlight>
      </View>
    )
  }

  const styles = StyleSheet.create({
      sectionTitle: {
        fontSize: 24,
        fontWeight: '800',
        marginTop: 12,
        marginBottom: 12,
        marginLeft: 12,
        marginRight: 12,
        maxWidth: '85%',
        fontFamily: 'VarelaRound_400Regular', 
        color: "#2b2e4a"
      }
  })