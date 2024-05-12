import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import { auth, firestore } from '../firebase/firebase';

const KelimeCevir = () => {
  const [hiraganaList, setHiraganaList] = useState([]);  
  const [currentHiragana, setCurrentHiragana] = useState("");  // Current Hiragana word
  const [userInput, setUserInput] = useState("");
  const [clientScore, setClientScore] = useState(0);
  const [user, setUser] = useState(null);
  
  const hiraganaRomajiMapping = {
    "こんにちは": "konnichiwa", // merhaba
    "ありがとう": "arigatou", // teşekkürler (glb)
    "あいさつ": "aisatsu", // selamlaşma
    "あかるい": "akarui", // parlak
    "いく": "iku", // gitmek
    "うみ": "umi", // deniz
    "えいご": "eigo", // İngilizce
    "おおきい": "ookii", // büyük
    "かさ": "kasa", // şemsiye
    "きょうしつ": "kyoushitsu", // sınıf
    "くるま": "kuruma", // araba
    "けしごむ": "keshigomu", // silgi
    "こうちゃ": "koucha", // çay
    "さかな": "sakana", // balık
    "しんぶん": "shinbun", // gazete
    "すみません": "sumimasen", // üzgünüm
    "せんせい": "sensei", // öğretmen
    "そうじ": "souji", // temizlik
    "たべもの": "tabemono", // yiyecek
    "ちいさい": "chiisai", // küçük
    "つくえ": "tsukue", // masa
    "てがみ": "tegami", // mektup
    "ともだち": "tomodachi", // arkadaş
    "なまえ": "namae", // isim
    "にほんご": "nihongo", // Japonca
    "ぬいぐるみ": "nuigurumi", // peluş oyuncak
    "ねこ": "neko", // kedi
    "のみもの": "nomimono", // içecek
    "はい": "hai", // evet
    "ひるごはん": "hirugohan", // öğle yemeği
    "ふうとう": "fuutou", // mektup
    "へや": "heya", // oda
    "ほん": "hon", // kitap
    "まど": "mado", // pencere
    "みず": "mizu", // su
    "めがね": "megane", // gözlük
    "もしもし": "moshimoshi", // alo
    "やさい": "yasai", // sebze
    "ゆうびんきょく": "yuubinkyoku", // postane
    "よる": "yoru", // gece
    "らいしゅう": "raishuu", // gelecek hafta
    "りんご": "ringo", // elma
    "わたし": "watashi" // ben
  };
  const elemanSayisi = Object.keys(hiraganaRomajiMapping).length;
 

  useEffect(() => {
    // Firebase auth durumunu izle
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
        const userRef = firestore.collection('users').doc(user.uid);
        userRef.get().then((doc) => {
          if (doc.exists) {
            const userData = doc.data();
            setClientScore(userData.userScore);
          }
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Aboneliği temizle
  }, []);

  useEffect(() => {
    // localStorage'dan skoru al
    const saklananSkor = localStorage.getItem('skor');
    if (saklananSkor) {
      setClientScore(parseInt(saklananSkor));
    }
  }, []);

 /* useEffect(() => {
    // Kelime sayısını güncelle
    setElemanSayisi(Object.keys(hiraganaRomajiMapping).length);
  }, []);
*/
  const generateRandomHiragana = () => {
    // Rasgele bir hiragana kelime seç
    const hiraganas = Object.keys(hiraganaRomajiMapping);
    const randomIndex = Math.floor(Math.random() * hiraganas.length);
    return hiraganas[randomIndex];
  };

  const handleCheckAnswer = () => {
    const userAnswer = userInput.toLowerCase();
    const correctAnswer = hiraganaRomajiMapping[currentHiragana];

    if (userAnswer === correctAnswer) {
      handleUpdateScore();
      console.log("Doğru!");
      alert("Tebrikler!")
    } else {
     console.log("Yanlış cevap verdiniz. doğru cevap:", correctAnswer, "sizin cevabımız:", userAnswer);
    }

    setUserInput("");
    setCurrentHiragana(generateRandomHiragana());
  };

  const handleUpdateScore = async () => {
    if (user) {
      const userRef = firestore.collection('users').doc(user.uid);
      const yeniBilgiler = {
        userScore: clientScore + 1,
      };
      await userRef.update(yeniBilgiler);
      setClientScore(prevScore => prevScore + 1); // Puanı güncelle
      console.log("Kullanıcı Bilgileri Güncellendi!");
    } else {
      console.error("Kullanıcı Oturumu Açılmamış!");
    }
  };

  useEffect(() => {
    setCurrentHiragana(generateRandomHiragana()); // İlk renderda bir hiragana kelime seç
  }, []);

  return (
    <div className='study-page'>
      <div className='header'>
        <div className='list1 container'>
          <br />
          <center>
            <div className='navbar'>
              <div className='score-text' style={{ fontSize: "48px" }}>
                Puan: {clientScore}
              </div>
              <div className='score-text' style={{ fontSize: "24px" }}>
                Quiz kümesindeki kelime sayısı: {elemanSayisi}
              </div>
             
            </div>
            <br></br>
            <div className='input-container container'>
            <div className='true-text-k'>
                {currentHiragana}  
              </div>
              <Form.Group controlId="userAnswer">
                <Form.Label>Cevap Giriniz:</Form.Label>
                <Form.Control
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                />
              </Form.Group>
              <button className='btn-p' onClick={() => handleCheckAnswer()}>
                Dogrula
              </button>
            </div>
            <br></br>
            <div className='button-group'>
              <button className='btn-p'>
                <a className='t' style={{ textDecoration: "none" }} href='/'>
                  <h1 className='t' style={{ color: "white" }}>Geri</h1>
                </a>
              </button>
              <button className='btn-p' onClick={() => setCurrentHiragana(generateRandomHiragana())}>
                <h1>Devam</h1>
              </button>
            </div>
          </center>
        </div>
      </div>
    </div>
  );
};

export default KelimeCevir;
