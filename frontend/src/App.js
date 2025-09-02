import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './store/auth/AuthProvider';
import { ThemeProvider } from './store/ThemeProvider';
import AppRouter from './navigation/AppRouter';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;