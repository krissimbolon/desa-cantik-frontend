// src/layouts/MainLayout.jsx
import React from 'react';
import Navbar from '@/components/shared/Navbar';
// import Footer from '@/components/shared/Footer'; 

// 'children' adalah konten halaman (misal: Home.jsx)
const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <header>
        {/* <Header /> */}
      </header>

      {/* Konten Halaman Utama akan dirender di sini */}
      
      <main className="flex-grow">
        {children}
      </main>
      
      <footer>
        {/* <Footer /> */}
      </footer>
      
    </div>
  );
};

export default MainLayout;