import React from "react"
import "./style.css"
import { Col, Container, Row } from "react-bootstrap"
import logo from "../../Images/logo1.png";

const Footer = () => {
  return (
    <footer>
        <Container>
          <Row className="footer-row">
            <Col md={3} sm={5} className='box'>
              <div className="logo">
              <img
            src={logo}
            alt="TechTrove Logo"
            style={{ height: "40px", width: "auto" }}
          />
                  <h1>TechTrove</h1>
              </div>
              <p>TechTrove is your ultimate destination for high-quality electronics and cutting-edge gadgets designed to simplify and enhance your daily life. Our mission is to bring you the latest technology at unbeatable prices, backed by excellent customer service and a seamless shopping experience.</p>
            </Col>
            <Col md={3} sm={5} className='box'>
              <h2>About Us</h2>
              <ul>
                <li>Careers</li>
                <li>Our Stores</li>
                <li>Our Cares</li>
                <li>Terms & Conditions</li>
                <li>Privacy Policy</li>
              </ul>
            </Col>
            <Col md={3} sm={5} className='box'>
              <h2>Customer Care</h2>
              <ul>
                <li>Help Center </li>
                <li>How to Buy </li>
                <li>Track Your Order </li>
                <li>Corporate & Bulk Purchasing </li>
                <li>Returns & Refunds </li>
              </ul>
            </Col>
            <Col md={3} sm={5} className='box'>
              <h2>Contact Us</h2>
              <ul>
                <li> </li>
                <li>Email: dhruvdalwadi05@gmai.com</li>
                <li>Phone: +91-9409584248</li>
              </ul>
            </Col>
          </Row>
        </Container>
    </footer>
  )
}

export default Footer
