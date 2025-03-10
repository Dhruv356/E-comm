import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import { Col, Container, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { FaStar, FaPlus, FaMinus } from "react-icons/fa";
import { addToCart } from "../../app/features/cart/cartSlice";
import axios from "axios";
import "./product-details.css";

const ProductDetails = ({ selectedProduct }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // ✅ Initialize navigate
  const dispatch = useDispatch();
  const [product, setProduct] = useState(selectedProduct || null);
  const [loading, setLoading] = useState(!selectedProduct);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

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

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) setQuantity(value);
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity((prev) => prev - 1);
  };

  const handleAddToCart = () => {
    dispatch(addToCart({ product, num: quantity }));
    toast.success("Product has been added to cart!");
  };

  const handleBuyNow = () => {
    if (!product) return;
  
    navigate("/checkout", {
      state: {
        orderItems: [
          {
            productId: product._id,
            name: product.productName,
            price: product.price,
            qty: quantity,
            imgUrl: product.imageUrl?.startsWith("/uploads")
              ? `http://localhost:5000${product.imageUrl}`
              : product.imgUrl || "/fallback-image.jpg", // ✅ Ensure correct image URL
          },
        ],
        directBuy: true, // ✅ Flag to differentiate from cart checkout
      },
    });
  };
  

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
              onError={(e) => {
                e.target.src = "/fallback-image.jpg";
              }}
            />
            <div className="thumbnail-container">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} className="thumbnail" src={product?.imgUrl} alt="Thumbnail" />
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

            <p className="description">{product.shortDesc}</p>

            <div className="quantity-controls">
              <button className="qty-btn" onClick={decrementQuantity}>
                <FaMinus />
              </button>
              <input
                className="qty-input"
                type="text"
                onChange={handleQuantityChange}
                value={quantity}
                min="1"
              />
              <button className="qty-btn" onClick={incrementQuantity}>
                <FaPlus />
              </button>
            </div>

            <div className="button-group">
              <button className="add-to-cart" onClick={handleAddToCart}>
                Add To Cart
              </button>
              <button className="buy-now" onClick={handleBuyNow}>
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
