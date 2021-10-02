import React, { useState } from 'react';
import { StyleSheet, Text, View, SectionList, TouchableHighlight, ActivityIndicator } from 'react-native';
import { useFonts, VarelaRound_400Regular } from '@expo-google-fonts/varela-round';
import * as Animatable from 'react-native-animatable'
import RecipeExplorer from './components/RecipeExplorer'
import SectionTitle from './components/SectionTitle'
import SectionItem from './components/SectionItem'
import themeColors from './config/themeColors'
import RecipeInput from './components/RecipeInput'
import useRecipes from './hooks/useRecipes'

import { RecipeSection, IngredientSectionItem, Webview } from './config/types'

export default function App() {
  const [recipes, setRecipes, importNewRecipe] = useRecipes()
  const [isLoading, setIsLoading] = useState(false)
  const [animationName, setAnimationName] = useState({} as any)
  const [isBeingDeleted, setIsBeingDeleted] = useState('')
  const [showRecipeExplorer, setShowRecipeExplorer] = useState(false)

  let [fontsLoaded] = useFonts({
    VarelaRound_400Regular,
  });

  async function handleTextChange (value: string) {
    setIsLoading(true)
    await importNewRecipe(value)
    setIsLoading(false)
  }

  function handleCheckItem (value: boolean, item: IngredientSectionItem) {
    setRecipes(recipes.map(r => {
      return { 
        ...r,
        data: r.data.map((i: IngredientSectionItem) => ({ ...i, checked: (i.raw === item.raw && r.data.includes(item)) ? !i.checked : i.checked })) }
    }))
  }

  function handleDeleteSection (section: RecipeSection) {
    const toBeAdded: any = {}
    toBeAdded[section.key] = 'fadeOutLeft'
    setAnimationName((anim:any) => ({ ...anim, ...toBeAdded }))
    setIsBeingDeleted(section.key)
  }

  function removeRecipe (section: RecipeSection) {
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
      <RecipeInput handleTextChange={handleTextChange} />
      
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
