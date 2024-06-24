import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavbarComponent from './components/NavbarComponent';
import AudioCompressor from './components/AudioCompressor';
import CompressImage from './components/CompressImage';

function App() {
  return (
    <>
      <NavbarComponent />
      <Container className="my-5">
        <Row className="justify-content-md-center">
          <Col xs lg="5" className="text-center">
            <AudioCompressor />
          </Col>
          <Col xs lg="5" className="text-center">
            <CompressImage />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
