import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SectionList, TextInput, TouchableHighlight, Clipboard, Image, ActivityIndicator } from 'react-native';
import { storeData, fetchData } from './api'
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import * as Animatable from 'react-native-animatable'
import RecipeExplorer from './components/RecipeExplorer'
import SectionTitle from './components/SectionTitle'
import SectionItem from './components/SectionItem'
import themeColors from './config/themeColors'

import { Recipe, RecipeSection, IngredientSectionItem, Webview } from './config/types'

const recipesEndpoint = 'https://stormy-wave-07737.herokuapp.com/'

export default function App() {
  const [recipes, setRecipes] = useState([] as Array<RecipeSection>)
  const [inputUrl, setInputUrl] = useState('')
  const firstUpdate = useRef(true)
  const [isLoading, setIsLoading] = useState(false)
  const [animationName, setAnimationName] = useState({} as any)
  const [isBeingDeleted, setIsBeingDeleted] = useState('')
  const [showRecipeExplorer, setShowRecipeExplorer] = useState(false)

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
      let { title, ingredients }: Recipe = await response.json()
      setIsLoading(false)
      const newRecipe: RecipeSection = { 
        title, 
        data: ingredients.map((i, index): IngredientSectionItem => ({ ...i, checked: false, key: index + i.raw })), 
        key: new Date().toISOString()
      }
      setRecipes(storedRecipes => [...storedRecipes, newRecipe])
    } catch (e) {
      alert('Impossible de récupérer la liste des ingrédients.\r\nL\'url renseignée est bien celle de la recette ?')
      setIsLoading(false)
    }
  }

  function handleCheckItem (value: boolean, item: IngredientSectionItem) {
    setRecipes(recipes.map(r => {
      return { 
        ...r,
        data: r.data.map((i: IngredientSectionItem) => ({ ...i, checked: (i.raw === item.raw && r.data.includes(item)) ? !i.checked : i.checked })) }
    }))
  }

  async function readInputFromClipBoard () {
    const url = await Clipboard.getString()
    setInputUrl(url)
    handleTextChange(url)
  }

  function handleDeleteSection (section: RecipeSection) {
    const toBeAdded: any = {}
    toBeAdded[section.key] = 'fadeOutLeft'
    setAnimationName((anim:any) => ({ ...anim, ...toBeAdded }))
    setIsBeingDeleted(section.key)
  }

  function removeRecipe (section: RecipeSection) {
    console.log({title: section.title, isBeingDeleted})
    if (isBeingDeleted === section.key) {
      setRecipes(recipes.filter(recipe => recipe.key !== section.key))
      setIsBeingDeleted('')
      delete animationName[section.key]
      setAnimationName(animationName)
    }
  }

  function handleRecipeConfirm (recipeUri: string, { stopLoading }: Webview) {
    stopLoading()
    setShowRecipeExplorer(false)
    handleTextChange(recipeUri)
  }

  function getAnimationName (sectionKey: string) : string {
    return Object.keys(animationName).length > 0 ? animationName[sectionKey] : 'bounceIn'
  }

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={{width: '80%', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
        <TextInput style={styles.urlInput} 
                   value={inputUrl} 
                   onChangeText={text => setInputUrl(text)}
                   onSubmitEditing={({ nativeEvent }) => handleTextChange(nativeEvent.text)}
                   placeholder="Entrer une url monsieur-cuisine"/>
        <TouchableHighlight onPress={readInputFromClipBoard} underlayColor="transparent" style={{width: 32, height: 32}}>
          <Image source={require('./assets/paste.png')} style={{width: 32, height: 32}}/>
        </TouchableHighlight>
      </View>
      
      <Text style={{paddingTop: 20}}>ou</Text>

      <TouchableHighlight style={styles.button} 
                          onPress={() => setShowRecipeExplorer(true)} 
                          underlayColor="#393E46" 
                          disabled={isLoading}>
        <Text style={styles.buttonText}>Rechercher une recette</Text>
      </TouchableHighlight>

      <ActivityIndicator size="large" color={themeColors.red} style={[styles.loader, !isLoading && styles.loaderDone]} animating={isLoading} />

      {recipes.length > 0 && <SectionList style={styles.section} 
                                          sections={recipes}
                                          renderItem={({ item, index, section }) => (
                                            <Animatable.View animation={getAnimationName(section.key)} 
                                                             duration={800}
                                                             useNativeDriver >
                                              <SectionItem item={item} 
                                                           onChecked={(v: boolean) => handleCheckItem(v, item)} 
                                                           index={index} />
                                            </Animatable.View>)}
                                          renderSectionHeader={({ section }) => (
                                            <Animatable.View animation={getAnimationName(section.key)}
                                                             duration={800}
                                                             onAnimationEnd={() => removeRecipe(section)}
                                                             useNativeDriver >
                                              <SectionTitle title={section.title || ''} 
                                                            onDelete={() => handleDeleteSection(section)} />
                                            </Animatable.View>
                                          )}
      />}
      
      { showRecipeExplorer && (
        <RecipeExplorer confirmRecipeSelection={handleRecipeConfirm} 
                        closeExplorer={() => setShowRecipeExplorer(false)} />
      )}
      
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
    width: '90%'
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
