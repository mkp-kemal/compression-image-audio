import video from '../assets/video.mp4';

const VideoCompressor = () => {
  return (
    <div>
      <video src={video} controls width="500" />
    </div>
  );
};

export default VideoCompressor;
