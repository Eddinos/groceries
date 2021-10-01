import React, { useState } from 'react'
import { Text, TouchableHighlight, StyleSheet, Image, Dimensions, View, Pressable } from 'react-native'
import { WebView } from 'react-native-webview'
import * as Animatable from 'react-native-animatable'
import themeColors from '../config/themeColors'
import { Webview } from '../config/types'

const CTA_LABELS = { 
    valid: 'Ajouter cette recette',
    invalid: 'Trouver une recette valide'
}

type PropsType = { 
    confirmRecipeSelection: (recipeUri: string, webview: Webview) => void, 
    closeExplorer: () => void 
}

export default function RecipeExplorer ({ confirmRecipeSelection, closeExplorer }: PropsType) {
    const [recipeUri, setRecipeUri] = useState('')
    const [actionText, setActionText] = useState(CTA_LABELS.invalid)
    const [isValidPage, setIsValidPage] = useState(false)

    let webview: Webview = {
        stopLoading: console.log
    }

    function handleWebViewNavigationStateChange ({ url, loading }: { url: string, loading: boolean }) {
        if (!loading && url.includes('recettes')) {
            setIsValidPage(true)
            setActionText(CTA_LABELS.valid)
        }
        setRecipeUri(url)
    }

    return (
        <Animatable.View style={styles.webview} 
                         animation="fadeInUpBig" 
                         duration={800} 
                         useNativeDriver>
            <View style={styles.actionBar}>
                <TouchableHighlight style={{ ...styles.confirmButton, opacity: isValidPage ? 1 : .3}} 
                                    onPress={() => confirmRecipeSelection(recipeUri, webview)} 
                                    underlayColor="#393E46" 
                                    disabled={!isValidPage}>
                    <Text style={styles.buttonText}>{actionText}</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.closeButton} 
                                    underlayColor="transparent"
                                    onPress={closeExplorer}>
                    <Image source={require('../assets/close.png')} style={{width: 24, height: 24}} />
                </TouchableHighlight>
            </View>
            
            <WebView source={{ uri: 'https://www.monsieur-cuisine.com/fr/' }}
                     ref={(ref: Webview | null) => webview = ref || { stopLoading: console.log }}
                     onNavigationStateChange={handleWebViewNavigationStateChange} />
        </Animatable.View>
    )
}

const styles = StyleSheet.create({
    confirmButton: {
        zIndex: 15,
        backgroundColor: themeColors.primary,
        padding: 10,
    },
    closeButton: {
        position: 'relative',
        left: '90%',
        width: 24,
    },
    buttonText: {
        color: themeColors.secondary, 
        fontFamily: 'VarelaRound_400Regular', 
        fontWeight: "bold", 
        fontSize: 18 
    },
    webview: {
        width: '100%',
        height: Dimensions.get('window').height,
        position: 'absolute',
        top: 40,
        left: 0,
        backgroundColor: themeColors.background
    },
    actionBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 12,
        width: Dimensions.get('window').width - 44,
        alignItems: 'center'
    }
})