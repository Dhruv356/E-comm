import { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";

const Login = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="login-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="login-form">
              <h2>Login</h2>
              <form>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Link to="/">
                <button type="submit" className="login-btn">
                  Login
                </button></Link>
              </form>
              <p className="signup-link">
                Don't have an account? <a href="/signup">Sign Up</a>
              </p>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Login;
