import React, { useState } from 'react'
import { Text, TouchableHighlight, StyleSheet, Image, Dimensions, View } from 'react-native'
import { WebView } from 'react-native-webview'
import * as Animatable from 'react-native-animatable'
import themeColors from '../config/themeColors'

export default function RecipeExplorer ({ confirmRecipeSelection, closeExplorer }: { confirmRecipeSelection: (recipeUri: string, webview: any) => void, closeExplorer: () => void }) {
    const [recipeUri, setRecipeUri] = useState('')

    let webview: { stopLoading: () => void } | null = null

    function handleWebViewNavigationStateChange ({ url }: { url: string}) {
        setRecipeUri(url)
    }

    return (
        <Animatable.View style={styles.webview} 
                         animation="fadeInUpBig" 
                         duration={800} 
                         useNativeDriver>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 12, width: Dimensions.get('window').width - 44, alignItems: 'center'}}>
                <TouchableHighlight style={styles.confirmButton} 
                                    onPress={() => confirmRecipeSelection(recipeUri, webview)} 
                                    underlayColor="#393E46">
                    <Text style={styles.buttonText}>Ajouter une recette</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.closeButton} 
                                    underlayColor="transparent"
                                    onPress={closeExplorer}>
                    <Image source={require('../assets/close.png')} style={{width: 24, height: 24}} />
                </TouchableHighlight>
            </View>
            
            <WebView source={{ uri: 'https://www.monsieur-cuisine.com/fr/' }}
                     ref={(ref) => (webview = ref)}
                     onNavigationStateChange={handleWebViewNavigationStateChange} />
        </Animatable.View>
    )
}

const styles = StyleSheet.create({
    confirmButton: {
        // position: 'absolute',
        // top: 80,
        // right: 0,
        zIndex: 15,
        backgroundColor: themeColors.primary,
        padding: 10,
    },
    closeButton: {
        position: 'relative',
        left: '90%',
        width: 24,
        // padding: 5
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
        left: 0
    }
})