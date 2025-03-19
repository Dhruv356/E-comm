import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);


  const [previewImage, setPreviewImage] = useState(null);
  const fetchSellerProducts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/products/my-products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error.response?.data || error.message);
      alert("Failed to load products");
    }
  };

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product._id !== id));
    } catch (error) {
      console.error("Error deleting product:", error.response?.data || error.message);
      alert("Failed to delete product.");
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct(product);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/products/${currentProduct._id}`,
        {
          productName: currentProduct.productName,
          price: currentProduct.price,
          category: currentProduct.category,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Product updated successfully!");
      setShowEditModal(false);
      fetchSellerProducts(); // Refresh the list after edit
    } catch (error) {
      console.error("Error updating product:", error.response?.data || error.message);
      alert("Failed to update product.");
    }
  };

  const [showFullDescription, setShowFullDescription] = useState(false);
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCurrentProduct({ ...currentProduct, imageFile: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };
  return (
    <div className="product-list-container">
      <h1>Product List</h1>
      {products.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <table className="product-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Description</th>
              <th>Category</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>
                  <img
                    src={`http://localhost:5000${product.imageUrl}`}
                    alt={product.productName}
                    className="product-img"
                    width="50"
                  />
                </td>
                <td>{product.productName}</td>
                <td>
                  <p className="description-seller">
                    {showFullDescription || product.description.length <= 100
                      ? product.description
                      : `${product.description.substring(0, 10)}...`}
                    {product.description.length > 100&& (
                      <button
                        className="view-more-btn"
                        onClick={() => setShowFullDescription(!showFullDescription)}
                      >
                        {showFullDescription ? "View Less" : "View More"}
                      </button>
                    )}
                  </p>
                </td>
                <td>{product.category}</td>
                <td>₹{product.price}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* ✅ Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentProduct && (
            <>
              {/* Product Image Preview */}
              <div className="image-preview-container">
                <img src={previewImage} alt="Preview" className="preview-image" />
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Product Image</Form.Label>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Product Name</Form.Label>
                <Form.Control
                  type="text"
                  value={currentProduct.productName}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, productName: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  value={currentProduct.price}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, price: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type="text"
                  value={currentProduct.category}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, category: e.target.value })
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={currentProduct.description}
                  onChange={(e) =>
                    setCurrentProduct({ ...currentProduct, description: e.target.value })
                  }
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductList;
