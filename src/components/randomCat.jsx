import React, { useState, useEffect } from 'react';
import Loading from './Loading';

import Login from './login';
import "../styles/Zirve.css"
const RandomCat = () => {
  const [cat, setCat] = useState('');
  const [loading, setLoading] = useState(undefined);
  const [done, setDone] = useState(undefined);

  useEffect(() => {
    getCat();
  }, []);

  const getCat = () => {
    setLoading(undefined);
    setDone(undefined);

    setTimeout(() => {
      fetch('https://aws.random.cat/meow')
      .then(res => res.json())
      .then(data => {
        setCat(data.file);
        setLoading(true);
        setTimeout(() => {
          setDone(true);
        }, 1000)
      })
      .catch(err => console.log(err));
    }, 1200);
  }

  // Style
   

  const catImage = {
    width: '100%',
    height: '30rem',
    objectFit: 'cover',
    borderRadius: '5px',
  }

  const btnStyle = {
    background: 'blue',
    padding: '0.5rem 1rem',
    border: 'none',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: 'white',
    cursor: 'pointer',
  }

  return (
    <div className="container">
        <center>
        
      <br></br>
      <Login></Login>
        </center>
    </div>
  )
}

export default RandomCat;