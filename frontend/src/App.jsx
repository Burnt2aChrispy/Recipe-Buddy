import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Auth from './pages/Auth'
import Recipes from './pages/Recipes'

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} /> {/* 🔄 Redirect */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/recipes" element={<Recipes />} />
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  )
}
