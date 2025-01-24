import { useState } from "react";
import { Fragment } from "react";
import { Col, Container, Row, Button } from "react-bootstrap";
import { products } from "../utils/products";  // Assuming you have this array
import ShopList from "../components/ShopList";  // Component to list products
import Banner from "../components/Banner/Banner";  // Banner component
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";  // Custom hook

const Shop = () => {
  const [filterList, setFilterList] = useState(products);
  const [activeCategory, setActiveCategory] = useState("All");

  // Get unique categories for buttons
  const categories = ["All", ...new Set(products.map((product) => product.category))];

  // Use custom hook to scroll to top
  useWindowScrollToTop();

  // Filter products by category
  const filterByCategory = (category) => {
    setActiveCategory(category);
    if (category === "All") {
      setFilterList(products); // Show all products
    } else {
      setFilterList(products.filter((item) => item.category === category)); // Filter by selected category
    }
  };

  return (
    <Fragment>
      <Banner title="Products" />
      <section className="filter-bar">
        <Container className="filter-bar-container">
          <Row className="justify-content-center">
            <Col md={12}>
              {/* Category Buttons */}
              <div className="category-buttons">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={activeCategory === category ? "active" : ""}
                    onClick={() => filterByCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
        <Container>
          {/* Display filtered products */}
          <ShopList productItems={filterList} />
        </Container>
      </section>
    </Fragment>
  );
};

export default Shop;
