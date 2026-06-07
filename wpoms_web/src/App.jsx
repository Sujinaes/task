import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'sonner';
import AppRoutes from './routes/index';

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" richColors />
      <AppRoutes />
    </Router>
  );
}

export default App;
