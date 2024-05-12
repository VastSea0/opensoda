import React, { useState, useEffect } from 'react';
import "../styles/Zirve.css";

function ButtonP({ text, oc }) {
  const [Btext, setText] = useState(0);
  const [Boc, setOc] = useState(0);
 
  useEffect(() => {
    setText(text);
  }, [text]);  
  useEffect(() => {
    setOc(oc);
  }, [oc]); 

  return (
        <button
        className=" btn-p"
        onClick={Boc} 
      
        >
            <h1>
            {Btext}
                </h1>
        </button>
       

    
  );
}

export default ButtonP;
