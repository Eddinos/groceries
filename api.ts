import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async ({ key, value }: { key: string, value: any }) => {
    try {
      const keys = await AsyncStorage.getAllKeys()
      if (keys.includes(key)) await AsyncStorage.mergeItem(`GroceriesStore:${key}`, JSON.stringify(value))
      else await AsyncStorage.setItem(`GroceriesStore:${key}`, JSON.stringify(value));
    } catch (error) {
      console.log('error storing data', error)
    }
  }
  
  const fetchData = async (key: string = 'recipes') => {
    try {
      const result = await AsyncStorage.getItem(`GroceriesStore:${key}`);
      return result;
    } catch (error) {
      console.log('error fetching data', error)
    }
  }

  export { storeData, fetchData }