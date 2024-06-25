import { useState } from "react";
import axios from "axios";
import { Helper } from "../helper/helper";

const VideoPage = () => {
  const {baseURLAPI} = Helper();
  const [compression1, setCompression1] = useState([]);
  const [compression2, setCompression2] = useState([]);
  const [onProcess, setOnProcces] = useState(0);

  const uploadFile = async (event) => {
    setOnProcces(1)
    let file   = event.target.files[0];
    
    if(file.size > 1024*1024*25){
      alert("Maksimal 25MB");
      setOnProcces(0)
      event.target.value = '';
      return false;
    }

    let formData = new FormData();
    formData.append('file', file);

    try {
      await axios
      .post(baseURLAPI('video/h264'), formData)
      .then((response) => {
        setCompression1(response.data);
      });
    } catch (error) {
      console.error(error);
    }
    try {
      await axios
      .post(baseURLAPI('video/h265'), formData)
      .then((response) => {
        setCompression2(response.data);
      });
    } catch (error) {
      console.error(error);
    }
    setOnProcces(0)
    event.target.value = '';
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-col justify-start items-start ">
        <h1 className="font-bold mt-20 text-3xl pb-5 ">Video Compression</h1>
        <h3 className="font-bold text-xl pb-3">
          Upload your video file and compress it
        </h3>

        <p>Upload an video file</p>
      </div>
      <div className="flex items-center justify-center mt-4 gap-x-8 bg-[#252730] p-6 rounded-lg cursor-pointer">
        <div className="">
          <p className="">Drag and drop file here</p>
          <p className="text-sm ">Limit 25MB per file • mp4</p>
        </div>
        <div className="mt-4 my-auto">
          <label className={` ${onProcess === 1 ? 'cursor-wait' : ''} bg-[#0e1117] border-2 border-gray-700 rounded-lg  hover:border-red-500 hover:text-red-500 text-white font-bold py-2 px-4 `}>
            Browse files
            <input type="file" disabled={ onProcess === 1 ? 'disabled' : '' } onChange={uploadFile} className="hidden" accept='.mp4' />
          </label>
        </div>
      </div>

      
      <div className="flex justify-start gap-x-4 items-start mt-4 mb-4">

        { compression1.original_size ? (
          <div className="bg-[#252730] p-6 rounded-lg p-3">
            <h1 className="font-bold text-xl pb-5 ">H.264</h1>
            <iframe src={baseURLAPI('../download_file/' + compression1.url)}  className='w-96' frameborder="0"></iframe>
            
            <table className='mt-3'>
              <tbody>
                <tr>
                  <td>Waktu Kompresi</td>
                  <td>: { Math.round(compression1.compression_time * 100) / 100 } Detik</td>
                </tr>
                <tr>
                  <td>Ukuran File Original</td>
                  <td>: { Math.round(compression1.original_size/1000/1000 * 100) / 100 }MB</td>
                </tr>
                <tr>
                  <td>Ukuran File Setelah Dikompresi</td>
                  <td>: { Math.round(compression1.compressed_size/1000/1000 * 100) / 100 }MB</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : ('')}

        { compression2.original_size ? (
          <div className="bg-[#252730] p-6 rounded-lg p-3">
            <h1 className="font-bold text-xl pb-5 ">H.265</h1>
            <iframe src={baseURLAPI('../download_file/' + compression1.url)}  className='w-96' frameborder="0"></iframe>
            
            <table className='mt-3'>
              <tbody>
                <tr>
                  <td>Waktu Kompresi</td>
                  <td>: { Math.round(compression2.compression_time * 100) / 100 } Detik</td>
                </tr>
                <tr>
                  <td>Ukuran File Original</td>
                  <td>: { Math.round(compression2.original_size/1000/1000 * 100) / 100 }MB</td>
                </tr>
                <tr>
                  <td>Ukuran File Setelah Dikompresi</td>
                  <td>: { Math.round(compression2.compressed_size/1000/1000 * 100) / 100 }MB</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : ('')}
        
      </div>

      { onProcess === 1 ? (
        <div className='fixed bg-[#252730]/[.5] top-0 left-0 right-0 bottom-0 flex justify-center items-center'>
          <div role="status">
              <svg aria-hidden="true" className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                  <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
              </svg>
              <span className="sr-only">Loading...</span>
          </div>
        </div>

      ) : ('') }
    </div>
  );
};

export default VideoPage;