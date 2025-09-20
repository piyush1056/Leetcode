
import React from "react";
import Plyr from "plyr-react";
import "plyr-react/plyr.css";

const Editorial = ({ sources, thumbnailUrl }) => {
  // Build the Plyr source config
  const plyrSource = {
    type: "video",
    title: "My Video",
    sources: sources, // e.g. [{src:"video-720.mp4",type:"video/mp4",size:720}]
    poster: thumbnailUrl,
  };

  const options = {
    controls: [
      "play-large",
      "play",
      "progress",
      "current-time",
      "duration",
      "mute",
      "volume",
      "captions",
      "settings", // shows speed + quality menu
      "fullscreen",
    ],
    settings: ["captions", "quality", "speed"], // enable menus
    quality: {
      default: 720,
      options: sources.map((s) => s.size), // e.g. [480,720]
      forced: true,
      onChange: (q) => console.log("quality changed", q),
    },
    speed: {
      selected: 1,
      options: [0.5, 1, 1.25, 1.5, 2],
    },
  };

  return (
    <div className="w-full max-w-2xl mx-auto rounded-xl overflow-hidden shadow-lg">
      <Plyr source={plyrSource} options={options} />
    </div>
  );
};

export default Editorial;
