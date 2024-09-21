
function VideoPlayer() {
    const handleVideoError = () => {
        alert("Error loading video. Please check the file path or try a different browser.");
      };
  return (
    <div>
      <h2>Video Player</h2>
      <video
        width="1200"
        controls
        autoPlay
        onError={handleVideoError}
        muted
      >
        <source src="/Videos/porsche1.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer