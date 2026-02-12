import React from "react";
import { PlayCircle } from "lucide-react";

const EditorialTab = ({ problem }) => {
  const video = problem?.video;

  if (!video || !video.secureUrl) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-base-content/50">
        <PlayCircle className="w-12 h-12 mb-2 opacity-20" />
        <p className="text-sm">
          No video editorial available for this problem.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <PlayCircle className="w-5 h-5 text-primary" />
        Video Explanation
      </h3>

      <div className="w-full max-w-3xl mx-auto">
        <video
          controls
          className="w-full rounded-xl border border-base-300 bg-black"
          poster={video.thumbnailUrl}
          controlsList="nodownload"
        >
          <source src={video.secureUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        {video.duration && (
          <p className="text-xs text-base-content/60 text-center mt-2">
            Duration: {Math.floor(video.duration / 60)} min
          </p>
        )}
      </div>
    </div>
  );
};

export default EditorialTab;
