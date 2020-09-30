import React, { useState, useEffect, useRef, ReactChild } from 'react';
import { StyleSheet, Text, View, SectionList, TextInput, TouchableHighlight, AsyncStorage, Clipboard, Button, FlatList, Image, ActivityIndicator } from 'react-native';
import SectionTitle from './SectionTitle'
import SectionItem from './SectionItem'
import { storeData, fetchData } from './api'
import { AppLoading } from 'expo'
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import * as Animatable from 'react-native-animatable'

const recipesEndpoint = 'https://stormy-wave-07737.herokuapp.com/'

const themeColors = {
  background: '#F8F3D4',
  primary: '#00B8A9',
  secondary: '#2B2E4A',
  red: '#f6416c'
}

export default function App() {
  const [recipes, setRecipes] = useState([] as Array<any>)
  const [inputUrl, setInputUrl] = useState('')
  const firstUpdate = useRef(true)
  const [isLoading, setIsLoading] = useState(false)
  const [animationName, setAnimationName] = useState('bounceIn')
  const [isBeingDeleted, setIsBeingDeleted] = useState(false)


  let [fontsLoaded] = useFonts({
    VarelaRound_400Regular,
  });

  useEffect(() => {
    fetchData().then(data => {
      data && setRecipes(JSON.parse(data))
    })
  }, [])

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    storeData({ key: 'recipes', value: recipes })
  }, [recipes])

  async function handleTextChange (value: string) {
    setIsLoading(true)
    try {
      const response = await fetch(`${recipesEndpoint}?url=${value}`)
      let { title, ingredients }: { title: string, ingredients: Array<any> } = await response.json()
      setIsLoading(false)
      const newRecipe = { title, data: ingredients.map((i, index) => ({ ...i, checked: false, key: index + i.raw })), key: new Date().toISOString()}
      setRecipes(storedRecipes => [...storedRecipes, newRecipe])
    } catch (e) {
      alert('Impossible de récupérer la liste des ingrédients.\r\nL\'url renseignée est bien celle de la recette ?')
      setIsLoading(false)
    }
  }

  function handleCheckItem (value: Boolean, item: any) {
    setRecipes(recipes.map(r => {
      return { ...r, data: r.data.map(i => ({ ...i, checked: (i.raw === item.raw && r.data.includes(item)) ? !i.checked : i.checked })) }
    }))
  }

  async function readInputFromClipBoard () {
    const url = await Clipboard.getString()
    setInputUrl(url)
    handleTextChange(url)
  }

  function handleDeleteSection () {
    setAnimationName('fadeOutLeft')
    setIsBeingDeleted(true)
  }

  function removeRecipe (section: any) {
    if (isBeingDeleted) {
      setRecipes(recipes.filter(recipe => recipe !== section))
      setIsBeingDeleted(false)
      setAnimationName('fadeIn')
    }
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <TextInput style={styles.urlInput} 
                 value={inputUrl} 
                 onSubmitEditing={({ nativeEvent }) => handleTextChange(nativeEvent.text)}
                 placeholder="url monsieur-cuisine"/>
      
      <TouchableHighlight style={styles.button} 
                          onPress={readInputFromClipBoard} 
                          underlayColor="#393E46" 
                          disabled={isLoading}>
        <Text style={styles.buttonText}>Ajouter une recette</Text>
      </TouchableHighlight>
      <ActivityIndicator size="large" color={themeColors.red} style={[styles.loader, !isLoading && styles.loaderDone]} animating={isLoading} />
      {recipes.length > 0 && <SectionList style={styles.section} 
                                          sections={recipes}
                                          renderItem={({ item, index }) => (<Animatable.View animation={animationName} duration={800} 
                                          useNativeDriver >
                                            <SectionItem item={item} onChecked={(v: Boolean) => handleCheckItem(v, item)} index={index} />
                                          </Animatable.View>)}
                                          renderSectionHeader={({ section }) => (
                                            <Animatable.View animation={animationName} duration={800} onAnimationEnd={() => removeRecipe(section)}
                                            useNativeDriver >
                                              <SectionTitle title={section.title} onDelete={handleDeleteSection} />
                                            </Animatable.View>
                                          )}
      />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeColors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    paddingBottom: 20
  },
  urlInput: {
    height: 40,
    margin: 0,
    marginRight: 7,
    paddingLeft: 10,
    borderStyle: 'solid',
    borderColor: themeColors.primary,
    borderWidth: 1,
    width: '80%'
  },
  section: {
    width: '95%'
  },
  button: {
    alignItems: "center",
    backgroundColor: themeColors.primary,
    padding: 18,
    marginTop: 18,
    borderRadius: 8
  },
  buttonText: { 
    color: themeColors.secondary, 
    fontFamily: 'VarelaRound_400Regular', 
    fontWeight: "bold", 
    fontSize: 18 
  },
  loader: {
    marginTop: '20%'
  },
  loaderDone: {
    display: 'none'
  }
});
