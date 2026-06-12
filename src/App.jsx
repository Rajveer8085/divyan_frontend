import { Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import Landing from './pages/Landing';
import AdminApp from './pages/admin/AdminApp';
import CreatorApp from './pages/creator/CreatorApp';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/creator/*" element={<CreatorApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
