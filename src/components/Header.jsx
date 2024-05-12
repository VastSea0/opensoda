import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare,   faGear, faBell, faPowerOff } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from "react-bootstrap";
import logo from "./../Logo128.png";
import Player from "./Player";
import { firestore, auth } from '../firebase/firebase'; // Firebase'den firestore ve auth modüllerini içe aktarın
const Header = () => {
    const [show, setShow] = useState(false); 
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [user, setUser] = useState(null);

    const handleLogout = () => {
        auth.signOut()
          .then(() => {
            // Kullanıcı oturumu başarıyla kapattığında kullanıcı durumunu null olarak ayarlayın
            setUser(null);
          })
          .catch((error) => {
            console.error('Oturum kapatma hatası:', error);
          }); 
    };
    return(
            <div className="header navbar">
                <div className="share">
                    <button  className="btn " onClick={() => {handleShow()}}>
                        <FontAwesomeIcon icon={faShare} size="xl" style={{color: "#d94039",}} />
                    </button>
                </div>
                <div className="logo">
                    <img src={logo}  style={{borderRadius:"50%"}}></img>
                </div>
                <a href="/" style={{color:"white"}}> 
                <h1 className="home-text"> 
                        Anasayfa  
                </h1>
                </a>
               
                <button  className="btn " onClick={() => {handleLogout()}}>
                        <FontAwesomeIcon icon={faPowerOff} size="xl" style={{color: "#d94039",}} />
                    </button>
                <h1>

              <Player ></Player>
                    
                </h1>
                {
                    /*
                      <div className="bell-gear">
                    <button  className="btn  ">
                        <FontAwesomeIcon  icon={faGear} size="xl" style={{color: "#d94039",}}  />   
                    </button>
                    <button  className="btn ">
                        <FontAwesomeIcon  icon={faBell} size="xl" style={{color: "#d94039",}}  />   
                    </button>
                </div>
                    */ 
                }
              
                <Modal show={show} onHide={handleClose} className='modal'>
            <Modal.Header closeButton>
            <Modal.Title >
            OpenSoda Projesini paylasarak bize destekl ol!
           
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            オープンソーダ
                <ul>
                    <li>
                        <a href="https://instagram.com/vastseaoffical">Instagram Resmi hesap</a>
                    </li>
                    <li>
                        <a href="https://www.instagram.com/marsstakiuzayliyim/">Instagram Egehan'ın</a>
                    </li>
                    <li>
                        Bizi paylas <br />
                        <code>
                        Sende OpenSoda ile Japon dilini geliştir! 
                        <br></br>
                       <a className="https://opensoda.vercel.app ">  https://opensoda.vercel.app  </a> 
                        </code>
                    </li>
                </ul>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Kapat
            </Button>
            <Button variant="primary" href='/calis' onClick={handleClose}>
            Calis
            </Button>
            </Modal.Footer>
      </Modal>
            </div>
    )
}

export default Header;