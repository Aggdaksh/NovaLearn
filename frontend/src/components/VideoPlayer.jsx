import React from 'react';
import myVideo from './video.mp4';

function VideoPlayer() {
  return (
    <div className="absolute bottom-0 right-[4%] w-[220px] md:w-[280px] lg:w-[320px]">
      <video
        src={myVideo}
        autoPlay
        loop
        controls
        className="w-full rounded-[20px] shadow-[0_18px_40px_rgba(15,23,42,0.22)] border-2 border-white"
        
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default VideoPlayer;
