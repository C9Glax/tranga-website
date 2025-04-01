import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// @ts-ignore
import '@fontsource/inter';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import {StrictMode} from "react";

export default function MyApp() {
    return (
        <StrictMode>
            <CssVarsProvider>
                {/* must be used under CssVarsProvider */}
                <CssBaseline />

                {/* The rest of your application */}
                <App />
            </CssVarsProvider>
        </StrictMode>
    );
}



createRoot(document.getElementById('root')!).render(
    <MyApp />
);
