import React, { useEffect, useState } from "react";
import axios from "axios";


const ProductList = () => {
    const [products, setProducts] = useState([]);

    // Fetch products from the backend
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/products");
                setProducts(response.data);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    // Delete product from the backend
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/products/${id}`);
            setProducts(products.filter((product) => product._id !== id));
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="product-list-container">
            <h1> Product List</h1>
            {products.length === 0 ? (
                <p className="no-products">No products found.</p>
            ) : (
                <table className="product-table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product) => (
                            <tr key={product._id}>
                                <td>
                                    <img src={`http://localhost:5000${product.imageUrl}`} alt={product.productName} className="product-img" />
                                </td>
                                <td>{product.productName}</td>
                                <td>{product.description}</td>
                                <td>${product.price}</td>
                                <td>
                                    <button className="edit-btn">Edit</button>
                                    <button className="delete-btn" onClick={() => handleDelete(product._id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ProductList;
