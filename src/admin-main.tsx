/**
 * Vendara Admin Portal - Main Entry Point
 * Desktop-first web portal for Vendara operations team
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import  AdminApp  from './admin/app/AdminApp';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AdminApp />
);