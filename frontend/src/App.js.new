import React from 'react';
import { AuthProvider } from './store/auth/AuthProvider';
import { ThemeProvider } from './store/ThemeProvider';
import AppRouter from './navigation/AppRouter';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;