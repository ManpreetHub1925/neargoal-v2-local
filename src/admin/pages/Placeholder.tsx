import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Placeholder() {
  const location = useLocation();
  const title = location.pathname.split('/').pop()?.replace(/-/g, ' ').toUpperCase();

  return (
    <div className="text-center py-20">
      <h1 className="text-3xl font-bold text-slate-300">{title}</h1>
      <p className="text-slate-500 mt-4">This module is under development.</p>
    </div>
  );
}
