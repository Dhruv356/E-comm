import { useState, Fragment } from "react";
import { products } from "../utils/products"; // Import product list
import ShopList from "../components/ShopList"; // Component to list products
import Banner from "../components/Banner/Banner"; // Banner component
import useWindowScrollToTop from "../hooks/useWindowScrollToTop"; // Custom hook
import "../index.css"; // Import custom CSS
import all from "../Images/all.jpg"; // Default image for "All" category

const Shop = () => {
  const [filterList, setFilterList] = useState(products);
  const [activeCategory, setActiveCategory] = useState("All");

  // Extract unique categories and validate them
  const categories = [
    "All",
    ...new Set(
      products
        .map((product) => (typeof product.category === "string" ? product.category : "Unknown")) // Validate category
    ),
  ];

  // Assign images to categories dynamically, ensuring valid `imgUrl`
  const categoryImages = {};
  products.forEach((product) => {
    if (
      !categoryImages[product.category] && // Check if not already assigned
      typeof product.imgUrl === "string" && // Validate `imgUrl` is a string
      product.imgUrl.trim() !== "" // Ensure `imgUrl` is not empty
    ) {
      categoryImages[product.category] = product.imgUrl;
    }
  });

  // Default category image for "All"
  const defaultCategoryImage = all;

  // Scroll to top on page load
  useWindowScrollToTop();

  // Filter products by category
  const filterByCategory = (category) => {
    setActiveCategory(category);
    setFilterList(
      category === "All"
        ? products
        : products.filter((item) => item.category === category)
    );
  };

  return (
    <Fragment>
      <Banner title="Products" />

      {/* {/ Category Cards Section /} */}
      <section className="category-section">
        <h2 className="section-title">Browse by Category</h2>
        <div className="category-container">
          {categories.map((category) => (
            <div
              key={category}
              className={`category-card ${activeCategory === category ? "active" : ""}`}
              onClick={() => filterByCategory(category)}
            >
              <img
                src={
                  category === "All"
                    ? defaultCategoryImage
                    : categoryImages[category] || defaultCategoryImage
                }
                alt={category}
                className="category-image"
              />
              <p className="category-name">{category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* {/ Product List /} */}
      <section className="products-section">
        <ShopList productItems={filterList} />
      </section>
    </Fragment>
  );
};

export default Shop;