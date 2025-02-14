import { Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./slidercard.css";

const SlideCard = ({ title, desc, cover }) => {
  const navigate = useNavigate(); // React Router Navigation Hook

  return (
    <Container className="box">
      <Row>
        <Col md={6}>
          <h1>{title}</h1>
          <p>{desc}</p>

          {/* Button Navigates to Shop Page */}
          <button className="shop-btn" onClick={() => navigate("/shop")}>
            Visit Collections
          </button>
        </Col>
        <Col md={6}>
          <img src={cover} alt="Product Cover" />
        </Col>
      </Row>
    </Container>
  );
};

export default SlideCard;
