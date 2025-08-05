import { Container, Form, Button } from 'react-bootstrap';

const DocumentGenerator = () => {
  return (
    <Container className="mt-5">
      <h1>Document Generator</h1>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Select Document Type</Form.Label>
          <Form.Select>
            <option>Independent Contractor Agreement</option>
            <option>Non-Disclosure Agreement (NDA)</option>
            <option>Website Terms of Use</option>
          </Form.Select>
        </Form.Group>
        <Button variant="primary" type="submit">
          Generate Document
        </Button>
      </Form>
    </Container>
  );
};

export default DocumentGenerator;

