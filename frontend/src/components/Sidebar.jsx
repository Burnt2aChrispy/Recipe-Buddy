import React from 'react';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { NavLink } from 'react-router-dom';
import 'react-pro-sidebar';
import { FaBook, FaShoppingCart, FaUser, FaBars } from 'react-icons/fa';

export default function AppSidebar({ collapsed, onToggle }) {
  return (
    <Sidebar collapsed={collapsed} style={{ height: '100vh' }}>
      <Menu iconShape="circle">
        <MenuItem
          icon={<FaBars />}
          onClick={onToggle}
          style={{ cursor: 'pointer', userSelect: 'none' }}
        >
          {!collapsed && 'Collapse'}
        </MenuItem>

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
    </Sidebar>
  );
}
