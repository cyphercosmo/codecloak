import React from 'react';
import TestRunner from '../test-runner';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Test() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <TestRunner />
      </main>
      <Footer />
    </div>
  );
}