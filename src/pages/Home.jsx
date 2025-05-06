// Updated Home page with hero section
import React from 'react';
import Layout from '../components/layout/Layout';

const Home = () => {
  return (
    <Layout>
      <div className='hero-section'>
        <h1>Welcome to Our 3D Furniture Store</h1>
        <p>Explore and visualize furniture in your space</p>
      </div>
    </Layout>
  );
};

export default Home;
