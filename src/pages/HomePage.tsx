import React from 'react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Section */}
      <div className="hero min-h-screen bg-gradient-to-br from-primary to-secondary">
        <div className="hero-content text-center text-primary-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Legally Legit AI</h1>
            <p className="mb-5">
              Your trusted AI-powered legal document assistant for Australian small businesses. 
              Generate compliant legal documents quickly and affordably.
            </p>
            <Link to="/dashboard">
              <button className="btn btn-accent btn-lg">Get Started</button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Legally Legit AI?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">🇦🇺</div>
                <h3 className="card-title justify-center">Australian Compliant</h3>
                <p>All documents are tailored for Australian law and business requirements.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="card-title justify-center">AI-Powered Speed</h3>
                <p>Generate professional legal documents in minutes, not hours.</p>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body text-center">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="card-title justify-center">Affordable Pricing</h3>
                <p>Save thousands on legal fees with our transparent pricing model.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
