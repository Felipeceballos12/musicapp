import 'react-native-gesture-handler'; // must be first
import { LogBox } from 'react-native';

import { registerRootComponent } from 'expo';

import App from '@/App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
