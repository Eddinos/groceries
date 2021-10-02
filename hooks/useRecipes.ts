import { useState, useEffect, useRef } from 'react'
import { storeData, fetchData } from '../api'

import { RecipeSection, Recipe, IngredientSectionItem } from '../config/types'

const recipesEndpoint = 'https://stormy-wave-07737.herokuapp.com/'


export default function useRecipes () {
    const [recipes, setRecipes] = useState([] as Array<RecipeSection>)
    const firstUpdate = useRef(true)

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

    async function importNewRecipe (url: string): Promise<void> {
        try {
            const response = await fetch(`${recipesEndpoint}?url=${url}`)
            let { title, ingredients }: Recipe = await response.json()
            const newRecipe: RecipeSection = { 
              title, 
              data: ingredients.map((i, index): IngredientSectionItem => ({ ...i, checked: false, key: index + i.raw })), 
              key: new Date().toISOString()
            }
            setRecipes(storedRecipes => [...storedRecipes, newRecipe])
          } catch (e) {
            alert('Impossible de récupérer la liste des ingrédients.\r\nL\'url renseignée est bien celle de la recette ?')
          }
    }

    return [recipes, setRecipes, importNewRecipe] as const

}