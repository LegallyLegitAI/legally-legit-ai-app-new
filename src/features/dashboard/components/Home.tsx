import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <Container className="mt-5">
      <h1>Welcome to Legally Legit AI</h1>
      <p>
        Your one-stop solution for generating AI-powered legal documents for your Australian
        business.
      </p>
      <Link to="/generator">
        <Button variant="primary">Get Started</Button>
      </Link>
    </Container>
  );
};

export default Home;

