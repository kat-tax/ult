import {AppRegistry} from 'react-native';
import {App} from './App';

AppRegistry.registerComponent('HelloWorld', () => App);
AppRegistry.runApplication('HelloWorld', {
  rootTag: document.getElementById('root'),
});
