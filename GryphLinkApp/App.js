import { createAppContainer } from 'react-navigation';
import { Drawer } from './navigation/appNav';

// The app is currently made from a drawer navigation layout
const App = createAppContainer(Drawer);

export default App;
