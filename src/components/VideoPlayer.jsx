import { useState } from 'react';
import { Alert } from 'antd';


function VideoPlayer() {
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
  };

  return (
    <div className='videoContainer' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
      <video
        style={{ maxWidth: '100%', borderRadius: '10px' }}
        controls
        autoPlay
        onError={handleVideoError}
        muted
      >
        <source src="/Videos/porsche1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {videoError && (
        <Alert
          message="Error loading video"
          description="Please check the file path or try a different browser."
          type="error"
          showIcon
          style={{ marginTop: '10px', width: '80%' }}
        />
      )}
    </div>
  );
}

export default VideoPlayer;
