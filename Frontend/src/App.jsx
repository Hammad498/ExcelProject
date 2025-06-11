// App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './AppRoutes.jsx'; // create separate component to handle Routes + Navbar

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
