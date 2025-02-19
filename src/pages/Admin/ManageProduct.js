import React, { useState } from "react";
import axios from "axios";

export const ManageProduct = () => {
  const [file, setFile] = useState(null);
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!productName || !price || !description) {
      alert("Please fill in all fields.");
      return;
    }

    const productData = new FormData();
    productData.append("productName", productName);
    productData.append("description", description);
    productData.append("price", price);
    if (file) {
      productData.append("file", file);
    }

    try {
    
      const response = await axios.post(
        "http://localhost:5000/api/products", // REMOVE "/add"
        productData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Product added successfully:", response.data);
      alert("Product added successfully!");

      // Clear the form after successful submission
      setProductName("");
      setDescription("");
      setPrice("");
      setFile(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product.");
    }
  };

  return (
    <div className="add-product">
      <div className="form-container">
        <h2>Add Product</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Image:</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>

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

          <div className="form-group">
            <label>Description:</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter brief description"
              required
            />
          </div>

          <button type="submit">Add Product</button>
        </form>
      </div>
    </div>
  );
};
