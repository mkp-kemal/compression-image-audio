import React, { useState, useEffect } from 'react';
import Dropzone from 'react-dropzone';
import swal from 'sweetalert';
import ffmpeg from 'ffmpeg.js/ffmpeg-mp4.js';

const AudioCompressor = () => {
  const [originalFileSize, setOriginalFileSize] = useState(0); // Ukuran file asli
  const [compressedFileSize, setCompressedFileSize] = useState(0); // Ukuran file setelah kompresi
  const [originalFile, setOriginalFile] = useState(null); // File asli
  const [compressedFile, setCompressedFile] = useState(null); // File setelah kompresi
  const [loading, setLoading] = useState(false);
  const [compressionTime, setCompressionTime] = useState(0); // Waktu kompresi
  const [compressionFormat, setCompressionFormat] = useState('mp3'); // Format kompresi

  const compressAudio = async (file) => {
    setLoading(true);
    try {
      // Simpan file asli
      setOriginalFile(file);

      // Hitung ukuran file asli
      setOriginalFileSize(file.size);

      const startTime = performance.now();

      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target.result;
        const transcode = ffmpeg({
          MEMFS: [{ name: file.name, data: result }],
          arguments: ['-i', file.name, '-b:a', '64k', '-f', 'mp3', 'output.mp3'],
        });

        const { MEMFS } = transcode;
        const compressedBlob = new Blob([MEMFS[0].data], { type: 'audio/mp3' });
        setCompressedFile(compressedBlob);

        // Hitung ukuran file setelah kompresi
        setCompressedFileSize(compressedBlob.size);

        const endTime = performance.now();
        const timeInSeconds = (endTime - startTime) / 1000;
        setCompressionTime(timeInSeconds.toFixed(2));

        setLoading(false);
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error('Error compressing audio:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (loading || compressedFile) {
      // Menghitung waktu kompresi hanya ketika loading atau compressedFile berubah
      console.log(`Waktu kompresi: ${compressionTime} detik`);
    }
  }, [loading, compressedFile, compressionTime]);

  const handleFormatChange = (format) => {
    setCompressionFormat(format);
  };
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '50px', textAlign: 'center', padding: '20px', backgroundColor: '#f4f4f4', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Kompresi Audio</h2>
      <div style={{ marginBottom: '20px' }}>
        <button
          style={{ marginRight: '10px', backgroundColor: compressionFormat === 'mp3' ? '#007bff' : '#ccc', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }}
          onClick={() => handleFormatChange('mp3')}
        >
          MP3
        </button>
        <button style={{ backgroundColor: compressionFormat === 'aac' ? '#007bff' : '#ccc', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer' }} onClick={() => handleFormatChange('aac')}>
          AAC
        </button>
      </div>
      <Dropzone onDrop={(acceptedFiles) => compressAudio(acceptedFiles[0])}>
        {({ getRootProps, getInputProps }) => (
          <div {...getRootProps()} style={{ cursor: 'pointer', padding: '20px', border: '2px dashed #007bff', borderRadius: '5px', marginBottom: '20px' }}>
            <input {...getInputProps()} />
            <p>Drop atau klik untuk mengunggah file</p>
          </div>
        )}
      </Dropzone>
      {loading ? (
        <p style={{ color: '#007bff', marginTop: '10px' }}>Proses kompresi sedang berlangsung...</p>
      ) : (
        <>
          {originalFile && (
            <>
              <h3>Audio Asli</h3>
              <audio controls src={URL.createObjectURL(originalFile)} style={{ marginTop: '20px' }} />
              <p style={{ marginTop: '10px' }}>Ukuran File Asli: {(originalFileSize / 1024).toFixed(2)} KB</p>
            </>
          )}
          {compressedFile && (
            <>
              <h3>Audio Setelah Kompresi</h3>
              <audio controls src={URL.createObjectURL(compressedFile)} style={{ marginTop: '20px' }} />
              <a href={URL.createObjectURL(compressedFile)} download="compressed_audio.mp3" style={{ display: 'block', marginTop: '10px', textDecoration: 'none', color: '#28a745' }}>
                Download Compressed Audio
              </a>
              <p style={{ marginTop: '10px' }}>Ukuran File Setelah Kompresi: {(compressedFileSize / 1024).toFixed(2)} KB</p>
              <p>Waktu Kompresi: {compressionTime} detik</p>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AudioCompressor;
