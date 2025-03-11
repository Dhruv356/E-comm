import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaStar, FaPlus, FaMinus } from "react-icons/fa";
import { addToCart } from "../../app/features/cart/cartSlice";
import axios from "axios";
import "./product-details.css";

const ProductDetails = ({ selectedProduct }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(selectedProduct || null);
  const [loading, setLoading] = useState(!selectedProduct);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [activeThumbnailIndex, setActiveThumbnailIndex] = useState(0); // ✅ Thumbnail index state

  useEffect(() => {
    if (!selectedProduct && id) {
      const fetchProduct = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/products/${id}`);
          setProduct(response.data);
        } catch (err) {
          setError("Failed to fetch product details.");
        } finally {
          setLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, selectedProduct]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveThumbnailIndex((prevIndex) => (prevIndex + 1) % 4); // ✅ Change thumbnail every few seconds
    }, 5000); // ✅ Change every 2 seconds

    return () => clearInterval(interval); // ✅ Cleanup interval on unmount
  }, []);

  if (loading) return <h2 className="loading">Loading...</h2>;
  if (error) return <h2 className="error">{error}</h2>;
  if (!product) return <h2 className="not-found">Product not found!</h2>;

  return (
    <section className="product-page">
      <Container>
        <Row className="product-wrapper">
          <Col md={6} className="image-section">
            <img
              loading="lazy"
              src={
                product?.imageUrl?.startsWith("/uploads")
                  ? `http://localhost:5000${product.imageUrl}`
                  : product?.imgUrl || "/fallback-image.jpg"
              }
              alt={product?.productName || "Product Image"}
              className="main-image"
            />

            {/* ✅ Auto-Cycling Thumbnail Section */}
            <div className="thumbnail-container">
              {[...Array(4)].map((_, i) => (
                <img
                  key={i}
                  className={`thumbnail ${i === activeThumbnailIndex ? "active" : ""}`}
                  src={
                    product.imageUrl?.startsWith("/uploads")
                      ? `http://localhost:5000${product.imageUrl}`
                      : product.imgUrl || "/fallback-image.jpg"
                  }
                  alt={`Thumbnail ${i}`}
                />
              ))}
            </div>
          </Col>

          <Col md={6} className="details-section">
            <h2 className="product-title">{product.productName}</h2>

            <div className="rate">
              {[...Array(5)].map((_, index) => (
                <FaStar key={index} color="#ffcd4e" size={16} />
              ))}
              <span>{product.avgRating} Ratings</span>
            </div>

            <div className="info">
              <span className="discounted-price">₹{product.price}</span>
            </div>

            <p className="description">
              {showFullDescription || product.description.length <= 100
                ? product.description
                : `${product.description.substring(0, 100)}...`}

              {product.description.length > 100 && (
                <button 
                  className="view-more-btn"
                  onClick={() => setShowFullDescription(!showFullDescription)}
                >
                  {showFullDescription ? "View Less" : "View More"}
                </button>
              )}
            </p>

            <div className="quantity-controls">
              <button className="qty-btn" onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}>
                <FaMinus />
              </button>
              <input
                className="qty-input"
                type="number"
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                value={quantity}
                min="1"
              />
              <button className="qty-btn" onClick={() => setQuantity((prev) => prev + 1)}>
                <FaPlus />
              </button>
            </div>

            <div className="button-group">
              <button className="add-to-cart" onClick={() => dispatch(addToCart({ product, num: quantity }))}>
                Add To Cart
              </button>
              <button className="buy-now" onClick={() => navigate("/checkout", {
                state: {
                  orderItems: [
                    {
                      productId: product._id,
                      name: product.productName,
                      price: product.price,
                      qty: quantity,
                      imgUrl: product.imageUrl?.startsWith("/uploads")
                        ? `http://localhost:5000${product.imageUrl}`
                        : product.imgUrl || "/fallback-image.jpg",
                    },
                  ],
                  directBuy: true,
                },
              })}>
                Buy Now
              </button>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default ProductDetails;
