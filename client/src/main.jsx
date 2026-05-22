import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import App from './App.jsx';
import './index.css';
import '@livekit/components-styles';
import { store } from './redux/store';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <Provider store={store}>
            <App />
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#ffffff',
                        color: '#1c1917',
                        border: '1px solid #e7e5e0',
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                        fontFamily: '"JetBrains Mono", monospace',
                        fontSize: '11px',
                        fontWeight: '700',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        borderRadius: '0.75rem',
                        padding: '12px 20px',
                    },
                    success: {
                        iconTheme: {
                            primary: '#2b4c3f',
                            secondary: '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: '#ffffff',
                        },
                    },
                }}
            />
        </Provider>
    </React.StrictMode>,
);
