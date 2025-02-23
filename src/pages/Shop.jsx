import { useState, useEffect, Fragment } from "react";
import { products as staticProducts } from "../utils/products"; // Static product list
import ShopList from "../components/ShopList";
import Banner from "../components/Banner/Banner";
import useWindowScrollToTop from "../hooks/useWindowScrollToTop";
import "../index.css";
import all from "../Images/all.jpg";
import { useLocation } from "react-router-dom";

const Shop = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [allProducts, setAllProducts] = useState(staticProducts);
  const [filterList, setFilterList] = useState(staticProducts);
  const [activeCategory, setActiveCategory] = useState("All");

  useWindowScrollToTop();

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products"); // Adjust URL as needed
        if (!response.ok) throw new Error("Failed to fetch products");

        const data = await response.json();
        const mergedProducts = [...staticProducts, ...data];

        setAllProducts(mergedProducts);
        setFilterList(mergedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setAllProducts(staticProducts); // Ensure static products are displayed
        setFilterList(staticProducts);
      }
    };

    fetchProducts();
  }, []);

  // Handle search functionality
  useEffect(() => {
    if (searchQuery) {
      const searchedProducts = allProducts.filter((item) =>
        item.productName?.toLowerCase().includes(searchQuery)
      );
      setFilterList(searchedProducts);
      setActiveCategory("All");
    } else {
      setFilterList(allProducts);
    }
  }, [searchQuery, allProducts]);

  // Generate categories based on available products
  const categories = [
    "All",
    ...new Set(
      (allProducts.length ? allProducts : staticProducts).map((product) =>
        typeof product.category === "string" ? product.category : "Unknown"
      )
    ),
  ];

  // Map categories to images
  const categoryImages = {};
  (allProducts.length ? allProducts : staticProducts).forEach((product) => {
    if (!categoryImages[product.category] && product.imgUrl?.trim()) {
      categoryImages[product.category] = product.imgUrl;
    }
  });

  // Handle category filtering
  const filterByCategory = (category) => {
    setActiveCategory(category);
    setFilterList(
      category === "All"
        ? allProducts
        : allProducts.filter((item) => item.category === category)
    );
  };

  return (
    <Fragment>
      <Banner title="Products" />

      {/* Category Cards */}
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
                src={categoryImages[category] || all}
                alt={category}
                className="category-image"
              />
              <p className="category-name">{category}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Product List */}
      <section className="products-section">
        <ShopList productItems={filterList} />
      </section>
    </Fragment>
  );
};

export default Shop;
