import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import AdminApp from './pages/admin/AdminApp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin/*" element={<AdminApp />} />
    </Routes>
  );
}

export default App;
