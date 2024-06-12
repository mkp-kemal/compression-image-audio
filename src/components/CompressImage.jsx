import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { createCanvas, loadImage } from 'canvas'; // untuk memampatkan gambar
import swal from 'sweetalert';

const CompressImage = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [compressedImage, setCompressedImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [fileName, setFileName] = useState('');
    const [imageWidth, setImageWidth] = useState(null);
    const [imageHeight, setImageHeight] = useState(null);
    const extension = 'jpeg'; // Menggunakan JPEG untuk kompresi lossy
    const [fileSize, setFileSize] = useState(null);
    const [compressedFileSize, setCompressedFileSize] = useState(null);
    const [compressionQuality, setCompressionQuality] = useState(0.7); // Default quality for JPEG
    const [compressionAccuracy, setCompressionAccuracy] = useState(null); // Persentase keakuratan kompresi

    const onDrop = async (acceptedFiles) => {
        if (acceptedFiles[0].type !== 'image/jpeg' && acceptedFiles[0].type !== 'image/png') {
            swal("File Error", "Format file tidak sesuai. Hanya file dengan format PNG atau JPG yang diizinkan.", "error");
            return;
        }

        // Set nama file, file terpilih, dan gambar yang diunggah sebagai preview
        setFileName(acceptedFiles[0].name);
        setSelectedFile(acceptedFiles[0]);
        setCompressedImage(null);
        setPreviewImage(URL.createObjectURL(acceptedFiles[0]));
        setFileSize(acceptedFiles[0].size);

        // Dapatkan informasi lebar dan tinggi gambar
        const img = new Image();
        img.src = URL.createObjectURL(acceptedFiles[0]);
        img.onload = function () {
            setImageWidth(this.width);
            setImageHeight(this.height);
        };
    };

    const handleCompress = async () => {
        if (!selectedFile) {
            swal("Error", "Tidak ada file yang dipilih.", "error");
            return;
        }

        setCompressing(true);

        try {
            const canvas = createCanvas();
            const ctx = canvas.getContext('2d');

            const img = await loadImage(URL.createObjectURL(selectedFile));
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const compressedImageUrl = canvas.toDataURL(`image/${extension}`, compressionQuality);
            setCompressedImage(compressedImageUrl);

            // Hitung ukuran file hasil kompresi
            const byteString = atob(compressedImageUrl.split(',')[1]);
            const byteLength = byteString.length;
            setCompressedFileSize(byteLength);

            // Hitung persentase keakuratan kompresi, batasi maksimum ke 100%
            let accuracy = (compressedFileSize / fileSize) * 100;
            if (accuracy > 100) {
                accuracy = 100;
            }
            setCompressionAccuracy(accuracy.toFixed(2));
        } catch (error) {
            swal("Error", "Terjadi kesalahan saat mengunggah file.", "error");
        } finally {
            setCompressing(false);
        }
    };

    const handleDownload = () => {
        if (compressedImage) {
            const downloadLink = document.createElement('a');
            downloadLink.href = compressedImage;
            downloadLink.download = `compressed_${fileName}_by_mkp.${extension}`; // Nama file saat diunduh
            downloadLink.click();
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'image/jpeg, image/png' // Batasi jenis file yang diizinkan menjadi png dan jpg
    });

    return (
        <div style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#333' }}>Kompresi Gambar</h2>
            <div {...getRootProps()} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '20px', padding: '20px', border: '2px dashed #007bff', borderRadius: '5px', cursor: 'pointer' }}>
                <input {...getInputProps()} />
                {previewImage && <img src={previewImage} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '5px' }} />}
                {!previewImage && <p style={{ margin: 0 }}>Drop atau klik untuk memilih gambar</p>}
            </div>

            {selectedFile && (
                <>
                    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                        <p>Ukuran file: {(fileSize / 1024).toFixed(2)} KB</p>
                        <p>Ukuran pixel: {imageWidth} x {imageHeight}</p>
                    </div>
                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <label htmlFor="quality">Quality (0.0 - 1.0): </label>
                        <input
                            id="quality"
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={compressionQuality}
                            onChange={(e) => setCompressionQuality(parseFloat(e.target.value))}
                            style={{ width: '50px', padding: '5px', borderRadius: '3px', border: '1px solid #ccc', backgroundColor: '#f9f9f9' }}
                        />
                    </div>
                    <button style={{ display: 'block', margin: '0 auto', padding: '10px 20px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }} onClick={handleCompress} disabled={!selectedFile}>
                        {compressing ? 'Compressing...' : 'Compress'}
                    </button>
                </>
            )}

            {compressedImage && (
                <>
                    <div style={{ marginBottom: '10px', textAlign: 'center' }}>
                        <p>Ukuran file setelah kompresi: {(compressedFileSize / 1024).toFixed(2)} KB</p>
                        <p>Persentase keakuratan kompresi: {compressionAccuracy}%</p>
                    </div>
                    <button style={{ margin: '20px auto 0', padding: '10px 20px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: compressing ? 'none' : 'block' }} onClick={handleDownload}>
                        Download Compressed Image
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                        <div style={{ flex: '1 1 48%', textAlign: 'center' }}>
                            <h3 style={{ color: '#333' }}>Before Compression:</h3>
                            <img src={previewImage} alt="Before Compression" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '5px' }} />
                        </div>
                        <div style={{ flex: '1 1 48%', textAlign: 'center' }}>
                            <h3 style={{ color: '#333' }}>After Compression:</h3>
                            <img src={compressedImage} alt="After Compression" style={{ maxWidth: '100%', maxHeight: '200px', objectFit: 'contain', border: '1px solid #ccc', borderRadius: '5px' }} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CompressImage;
