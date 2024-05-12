import {React, useState} from "react";
import useSound from "use-sound";  
import { Modal, Button } from "react-bootstrap";
import qala from "../assets/bg.mp3";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMusic } from '@fortawesome/free-solid-svg-icons';
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai"; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi"; // icons for next and previous track
import { IconContext } from "react-icons" 
import logo from "../Logo128.png";

const Player = () => {
    const [songModalShow, setSongModalShow] = useState(false);
    //  Şarkı...
    const [isPlaying, setIsPlaying] = useState(false);
    const [play, { pause, duration, sound }] = useSound(qala);
    
    const handleMusicPlayerShow = () => setSongModalShow(true);
    const handleMusicPlayerClose = () => setSongModalShow(false);

    const playingButton = () => {
        if (isPlaying) {
        pause(); // this will pause the audio
        setIsPlaying(false);
        } else {
        play(); // this will play the audio
        setIsPlaying(true);
        }
    };

    return(
        <>
         <button className='btn' onClick={() => {handleMusicPlayerShow()}} > 
                <FontAwesomeIcon className='score-text' size='3x' icon={faMusic} />
              </button>
              <Modal show={songModalShow} onHide={handleMusicPlayerClose} className='modal'>
      <div className="component">
      <h2>Sarkı ile calis</h2>
      <img
        className="musicCover"
        src={logo}
      />
      <div>
        <h3 className="title">BoyNight Sakura of Dead Spirits</h3>
        <p className="subTitle">8BitGame BoyNight Sakura of Dead Spirits Touhou 13MMXtreme 2 Style</p>
      </div>
      <div>
        <button className="playButton">
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipPrevious />
          </IconContext.Provider>
        </button>
        {!isPlaying ? (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPlayCircle />
            </IconContext.Provider>
          </button>
        ) : (
          <button className="playButton" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
              <AiFillPauseCircle />
            </IconContext.Provider>
          </button>
        )}
        <button className="playButton">
          <IconContext.Provider value={{ size: "3em", color: "#27AE60" }}>
            <BiSkipNext />
          </IconContext.Provider>
        </button>
      </div>
    </div>
      </Modal>
        </>
    )
}

export default Player;