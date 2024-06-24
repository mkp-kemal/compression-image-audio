import { Routes, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavbarComponent from './components/NavbarComponent';
import AudioCompressor from './components/AudioCompressor';
import CompressImage from './components/CompressImage';
import VideoCompressor from './components/VideoCompressor';
import HomeComponent from './components/HomeComponent';

function App() {
  return (
    <>
      <NavbarComponent />
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/audio" element={<AudioCompressor />} />
        <Route path="/image" element={<CompressImage />} />
        <Route path="/video" element={<VideoCompressor />} />
      </Routes>
      {/* <Container className="my-5">
        <Row className="justify-content-md-center">
          <Col xs lg="5" className="text-center">
            <AudioCompressor />
          </Col>
          <Col xs lg="5" className="text-center">
            <CompressImage />
          </Col>
          <Col xs lg="5" className="text-center">
            <VideoCompressor />
          </Col>
        </Row>
      </Container> */}
    </>
  );
}

export default App;
