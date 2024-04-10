import Form from './components/Form';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


function App() {
  return (
      <Router>
        <Routes>
          <Route path='/reset-password' element={<Form />}  />
        </Routes>
      </Router>
  );
}

export default App;
