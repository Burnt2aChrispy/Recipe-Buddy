import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Recipes from './pages/Recipes';
import ShoppingList from './pages/ShoppingList';
import Profile from './pages/Profile';

export default function App() {
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidth = collapsed ? 80 : 250;

  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <div style={{ width: sidebarWidth, transition: 'width 0.3s' }}>
          <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
        </div>

        <main style={{ flex: 1, padding: 24 }}>
          <Routes>
            <Route path="/" element={<Recipes />} />
            <Route path="/shopping" element={<ShoppingList />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
