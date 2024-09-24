import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from './App'; // Importa tu RootStackParamList

// Define el tipo de navegación para PreloaderCircle
type NavigationProp = StackNavigationProp<RootStackParamList, 'PreloaderCircle'>;

export const navigateWithPreloader = (nextScreen: keyof RootStackParamList) => {
  const navigation = useNavigation<NavigationProp>();

  // Navega a PreloaderCircle pasando el próximo screen
  navigation.navigate('PreloaderCircle', { nextScreen });
};
