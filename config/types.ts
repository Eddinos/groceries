type Recipe = {
    ingredients: Array<Ingredient>,
    title: string
} 

type Section<Type, Second> = {
    [Property in keyof Type]?: Type[Property]
} & { 
    key: string, 
    data: Array<Second> 
}

type SectionItem<Type> = { 
    [Property in keyof Type]?: Type[Property]
} & { 
    key: string, 
    checked: boolean 
}

type IngredientSectionItem = SectionItem<Ingredient>
type RecipeSection = Section<Recipe, IngredientSectionItem>

type Ingredient = { 
    value: Array<string>,
    label: Array<string>,
    raw: string
}

type Webview = { 
    stopLoading: () => void
}

export { 
    Recipe,
    RecipeSection,
    Ingredient,
    IngredientSectionItem,
    Webview
}