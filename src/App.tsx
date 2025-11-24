import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "./components/ui/sonner";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import HomePage from "./pages/home";

// Configuration de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});


function App() {

  return (
    // Le ThemeProvider gère le thème de l'application (clair/sombre)
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <Router>
              <Routes>

                <Route index element={<HomePage />} />

                {/* Redirection par défaut */}
                <Route path="*" element={<HomePage />} />

              </Routes>

            </Router>

            {/* Toaster pour les notifications */}
            <Toaster 
              richColors
              closeButton
            />
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
