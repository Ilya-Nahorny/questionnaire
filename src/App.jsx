import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import QuestionnaireForm from './components/QuestionnaireForm';
import DriverRealtimeList from './components/DriverRealtimeList'; // Добавьте этот импорт
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/style.css'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QuestionnaireForm />} />
        <Route path="/drivers" element={<DriverRealtimeList />} /> 
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
