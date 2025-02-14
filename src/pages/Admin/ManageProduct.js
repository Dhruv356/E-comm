import React, { useState } from "react";


export const ManageProduct = () => {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Product Added:", { productName, price, file });
    alert("Product added successfully!");
    setProductName("");
    setPrice("");
    setFile(null);
  };

  return (
    <div className="add-product">
      <div className="form-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          {/* Image Upload */}
          <div className="form-group">
            <label>Image:</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
            />
          </div>

          {/* Product Name */}
          <div className="form-group">
            <label>Product Name:</label>
            <input 
              type="text" 
              value={productName} 
              onChange={(e) => setProductName(e.target.value)} 
              placeholder="Enter product name" 
              required
            />
          </div>

          {/* Price */}
          <div className="form-group">
            <label>Price:</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)} 
              placeholder="Enter price" 
              required
            />
          </div>

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};
