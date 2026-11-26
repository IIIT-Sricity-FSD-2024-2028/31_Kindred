import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthProvider.jsx';
import { ToastProvider } from './contexts/ToastProvider.jsx';
import App from './App.jsx';
import { prepareRouteStyles } from './routes/routeStyles.js';
import './styles/shared-ui.css';
import './styles/pages.css';
import { Provider } from 'react-redux';
import { store } from './store/store.js';

prepareRouteStyles().finally(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <Provider store={store}><BrowserRouter>
        <AuthProvider>
          <ToastProvider><App /></ToastProvider>
        </AuthProvider>
      </BrowserRouter></Provider>
    </StrictMode>,
  );
});
