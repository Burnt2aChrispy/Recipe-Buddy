import React, { useState } from 'react';
import { Sidebar as ProSidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import 'react-pro-sidebar';

// Icons from react-icons (you can pick any you like)
import { FaBook, FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div style={{ height: '100vh' }}>
      <ProSidebar collapsed={collapsed} style={{ height: '100%' }}>
        <Menu iconShape="circle">
          {/* Toggle Button */}
          <MenuItem
            icon={<FaBars />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ cursor: 'pointer', userSelect: 'none' }}
          >
            {!collapsed && 'Collapse'}
          </MenuItem>

          {/* Menu Items with icons */}
          <MenuItem icon={<FaBook />}>
            <NavLink
              to="/"
              style={({ isActive }) => ({
                color: isActive ? 'red' : 'inherit',
                textDecoration: 'none',
              })}
            >
              Recipes
            </NavLink>
          </MenuItem>

          <MenuItem icon={<FaShoppingCart />}>
            <NavLink
              to="/shopping"
              style={({ isActive }) => ({
                color: isActive ? 'red' : 'inherit',
                textDecoration: 'none',
              })}
            >
              Shopping List
            </NavLink>
          </MenuItem>

          <MenuItem icon={<FaUser />}>
            <NavLink
              to="/profile"
              style={({ isActive }) => ({
                color: isActive ? 'red' : 'inherit',
                textDecoration: 'none',
              })}
            >
              Profile
            </NavLink>
          </MenuItem>
        </Menu>
      </ProSidebar>
    </div>
  );
}
