import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faPause, faRandom } from "@fortawesome/free-solid-svg-icons";

import song1 from "../audio/song1.mp3";
import song2 from "../audio/song2.mp3";
import song3 from "../audio/song3.mp3";

const MyCustomWidget = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRandomPlay, setIsRandomPlay] = useState(false);
  const [songs, setSongs] = useState([
    { src: song1, type: "audio/mpeg" },
    { src: song2, type: "audio/mpeg" },
    { src: song3, type: "audio/mpeg" },
  ]);

  const togglePlay = () => {
    if (audioRef.current.paused) {
      const playPromise = audioRef.current.play();

      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Playback started successfully
            setIsPlaying(true);
          })
          .catch((error) => {
            // Playback was prevented or failed
            setIsPlaying(false);
            console.log(error);
          });
      } else {
        setIsPlaying(true);
      }
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleRandomPlay = () => {
    setIsRandomPlay(!isRandomPlay);
  };

  const handleEnded = () => {
    if (isRandomPlay) {
      const randomIndex = Math.floor(Math.random() * songs.length);
      const nextSong = songs[randomIndex];
      audioRef.current.src = nextSong.src;
      audioRef.current.load();
      audioRef.current.play();
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div className="mp3-widget">
      <audio ref={audioRef} onEnded={handleEnded}>
        {songs.map((song, index) => (
          <source key={index} src={song.src} type={song.type} />
        ))}
      </audio>
      <button className="control-button" onClick={togglePlay}>
        {isPlaying ? (
          <FontAwesomeIcon icon={faPause} />
        ) : (
          <FontAwesomeIcon icon={faPlay} />
        )}
      </button>
      <button className="control-button" onClick={toggleRandomPlay}>
        <FontAwesomeIcon icon={faRandom} />
      </button>
    </div>
  );
};

export default MyCustomWidget;
