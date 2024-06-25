import { useState } from 'react';
import axios from 'axios';
import { Helper } from '../helper/helper';
import { Container, Row, Col, Card, Form, Button, Spinner, Overlay } from 'react-bootstrap';

const VideoPage = () => {
  const { baseURLAPI } = Helper();
  const [compression1, setCompression1] = useState([]);
  const [compression2, setCompression2] = useState([]);
  const [onProcess, setOnProcces] = useState(0);

  const uploadFile = async (event) => {
    setOnProcces(1);
    let file = event.target.files[0];

    if (file.size > 1024 * 1024 * 25) {
      alert('Maksimal 25MB');
      setOnProcces(0);
      event.target.value = '';
      return false;
    }

    let formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post(baseURLAPI('video/h264'), formData).then((response) => {
        setCompression1(response.data);
      });
    } catch (error) {
      console.error(error);
    }
    try {
      await axios.post(baseURLAPI('video/h265'), formData).then((response) => {
        setCompression2(response.data);
      });
    } catch (error) {
      console.error(error);
    }
    setOnProcces(0);
    event.target.value = '';
  };

  console.log(compression1, compression2);
  return (
    <Container className="mt-5">
      <Row className="justify-content-center text-white">
        <Col xs={12} className="text-center">
          <h1 className="font-bold mt-5 mb-4 text-3xl">Video Compression</h1>
          <h3 className="font-bold text-xl mb-3">Upload your video file and compress it</h3>
          <p>Upload a video file</p>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        <Col xs={12} md={6} className="d-flex justify-content-center gap-2">
          <Card className="p-4 bg-white text-black rounded-lg cursor-pointer">
            <div className="text-center">
              <p className="mb-1">Drag and drop file here</p>
              <p className="text-sm mb-0">Limit 25MB per file • mp4</p>
            </div>
            <div className="mt-3 text-center text-black">
              <label className={` ${onProcess === 1 ? 'cursor-wait' : ''} bg-[#0e1117] border-2 border-gray-700 rounded-lg  hover:border-red-500 hover:text-red-500 text-black font-bold py-2 px-4 `}>
                Browse files
                <input type="file" disabled={onProcess === 1 ? 'disabled' : ''} onChange={uploadFile} className="hidden" accept=".mp4" />
              </label>
              {onProcess === 1 && <Spinner animation="border" role="status" variant="primary" className="w-5 h-5 text-black" />}
            </div>
          </Card>
        </Col>
      </Row>

      <Row className="justify-content-center mt-4">
        {compression1.original_size && (
          <Col xs={12} md={6} className="mb-4">
            <Card className="bg-white text-black rounded-lg p-4">
              <h1 className="font-bold text-xl mb-3">H.264</h1>
              <video src={baseURLAPI('../download_file/' + compression1.url)} className="w-96" controls></video>
              <table className="mt-3">
                <tbody>
                  <tr>
                    <td>Compression Time</td>
                    <td>: {Math.round(compression1.compression_time * 100) / 100} Seconds</td>
                  </tr>
                  <tr>
                    <td>Original File Size</td>
                    <td>: {Math.round((compression1.original_size / 1000000) * 100) / 100} MB</td>
                  </tr>
                  <tr>
                    <td>Compressed File Size</td>
                    <td>: {Math.round((compression1.compressed_size / 1000000) * 100) / 100} MB</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Col>
        )}

        {compression2.original_size && (
          <Col xs={12} md={6} className="mb-4">
            <Card className="bg-white text-black rounded-lg p-4">
              <h1 className="font-bold text-xl mb-3">H.265</h1>
              <video src={baseURLAPI('../download_file/' + compression1.url)} className="w-96" controls></video>
              <table className="mt-3">
                <tbody>
                  <tr>
                    <td>Compression Time</td>
                    <td>: {Math.round(compression2.compression_time * 100) / 100} Seconds</td>
                  </tr>
                  <tr>
                    <td>Original File Size</td>
                    <td>: {Math.round((compression2.original_size / 1000000) * 100) / 100} MB</td>
                  </tr>
                  <tr>
                    <td>Compressed File Size</td>
                    <td>: {Math.round((compression2.compressed_size / 1000000) * 100) / 100} MB</td>
                  </tr>
                </tbody>
              </table>
            </Card>
          </Col>
        )}
      </Row>

      {/* Loading overlay using Bootstrap Overlay and Spinner */}
    </Container>
  );
};

export default VideoPage;
