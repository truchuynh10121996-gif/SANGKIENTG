import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Pages
import Dashboard from './pages/Dashboard';
import QAManagement from './pages/QAManagement';
import ChatbotPreview from './pages/ChatbotPreview';
import Layout from './components/Layout';

// Theme configuration
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20'
    },
    secondary: {
      main: '#FBD6E3',
      light: '#FFE6F0',
      dark: '#E8B4C9'
    },
    background: {
      default: 'transparent',
      paper: 'rgba(255, 255, 255, 0.9)'
    }
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontWeight: 700
    },
    h5: {
      fontWeight: 600
    }
  },
  shape: {
    borderRadius: 12
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/qa-management" element={<QAManagement />} />
            <Route path="/chatbot-preview" element={<ChatbotPreview />} />
          </Routes>
        </Layout>
      </Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333'
          },
          success: {
            iconTheme: {
              primary: '#2E7D32',
              secondary: '#fff'
            }
          },
          error: {
            iconTheme: {
              primary: '#d32f2f',
              secondary: '#fff'
            }
          }
        }}
      />
    </ThemeProvider>
  );
}

export default App;
