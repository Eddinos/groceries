import React, { useState } from 'react'
import { View, TouchableHighlight, Image, TextInput, StyleSheet, Clipboard } from 'react-native'
import themeColors from '../config/themeColors'

// TODO The use of not deprecated expo clipboard throws 
// Error: Encountered an exception while calling native method: Exception occurred while executing exported method getStringAsync on module ExpoClipboard: Cannot convert argument of type class android.text.SpannableString 

type PropsType = {
    handleTextChange: (url:string) => void
}

export default function RecipeInput ({ handleTextChange }: PropsType) {
    const [inputUrl, setInputUrl] = useState('')

    const readInputFromClipBoard = async () => {
        const url = await Clipboard.getString()
        setInputUrl(url)
        handleTextChange(url)
    }

    return (
        <View style={styles.recipeInput}>
            <TextInput style={styles.urlInput} 
                    value={inputUrl} 
                    onChangeText={text => setInputUrl(text)}
                    onSubmitEditing={({ nativeEvent }) => handleTextChange(nativeEvent.text)}
                    placeholder="Entrer une url monsieur-cuisine"/>
            <TouchableHighlight onPress={readInputFromClipBoard} underlayColor="transparent" style={{width: 32, height: 32}}>
                <Image source={require('../assets/paste.png')} style={{width: 32, height: 32}}/>
            </TouchableHighlight>
        </View>
    )
}

const styles = StyleSheet.create({
    recipeInput: {
        width: '80%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    urlInput: {
        height: 40,
        margin: 0,
        marginRight: 7,
        paddingLeft: 10,
        borderStyle: 'solid',
        borderColor: themeColors.primary,
        borderWidth: 1,
        width: '90%'
    }
})