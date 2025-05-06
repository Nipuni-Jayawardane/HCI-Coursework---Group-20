// Enhanced ProductCard with 3D preview button
import React from 'react';

const ProductCard = ({ product }) => {
  return (
    <div className='product-card'>
      <img src={product.image} alt={product.name} className='product-image' />
      <div className='product-info'>
        <h3>{product.name}</h3>
        <p>{product.price}</p>
        <button className='view-3d-btn'>View in 3D</button>
      </div>
    </div>
  );
};

export default ProductCard;
