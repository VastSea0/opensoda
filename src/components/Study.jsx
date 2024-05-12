// OpenSoda Projesi
// Yazar: Egehan KAHRAMAN
// Rota: /calis

import React, { useState, useEffect } from 'react';
import { Modal, Button } from "react-bootstrap";
import Player from './Player';
import { auth, firebase, firestore } from '../firebase/firebase';


const Study = () => {
  // Seçilen planın durumu ve setlenmesi :)
  const [selectedPlan, setSelectedPlan] = useState("list1");  // 60 Karakter
  // Hiragana listesinin durumu ve setlenmesi
  const [hiraganaList, setHiraganaList] = useState([]);  
  // Şu anki Hiragana karakteri ve setlenmesi
  const [currentHiragana, setCurrentHiragana] = useState("");  
  // Cevap seçenekleri ve setlenmesi
  const [answerOptions, setAnswerOptions] = useState([]);  
  // Müşteri puanı ve setlenmesi
  const [clientScore, setClientScore] = useState(0);  
  // Uyarı gösterme durumu ve setlenmesi
  const [alertShow, setAlertShow] = useState(false);
  // helo
  const [heloShow, setHeloShow] = useState(false);
  // Yanlış mesajı gösterme durumu ve setlenmesi
  const [wrongMessageVisible, setWrongMessageVisible] = useState(false);  
  // sayi falan
  const [sayiVal, setSayiVal] = useState(1);
  // Oturum bilgilerini çek ve yaz
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase Authentication kullanarak oturum açmış olan kullanıcıyı alın
    const unsubscribe = auth.onAuthStateChanged((user) => {
        if (user) {
            // Oturum açılmışsa, kullanıcıyı state'e kaydedin
            setUser(user);
            // Kullanıcının userScore değerini firestore'dan alın
            const userRef = firestore.collection('users').doc(user.uid);
            userRef.get().then((doc) => {
            if (doc.exists) {
                const userData = doc.data();
                setClientScore(userData.userScore);
            }
            });

        } else {
            // Oturum açılmamışsa, kullanıcıyı state'ten kaldırın
            setUser(null);
        }
    });

    // Aboneliği temizleyin
    return () => unsubscribe();
}, []); // Effect, yalnızca bir kere çalıştırılsın ve bileşenin sıfırlanmasında temizlensin
  const handleUpdateScore = async () => {
    if (user) {
      // Kullanıcının belgesine referans oluştur
      const userRef = firestore.collection('users').doc(user.uid);

      // Kaydetmek istediğiniz bilgileri hazırlayın
      const yeniBilgiler = {
        userScore: clientScore + 1,
      };
      // Bilgileri kullanıcı belgesine ekleyin
      await userRef.update(yeniBilgiler);
      // Başarılı kaydetme mesajı gösterin
      console.log("Kullanıcı Bilgileri Kaydedildi!");
    } else {
      // Oturum açmamışsa hata mesajı gösterin
      console.error("Kullanıcı Oturumu Açılmamış!");
    }
  };



  // Hiragana karakterlerinin Romaji karşılıkları
  const hiraganaRomajiMapping = {
    "あ": "a", "い": "i", "う": "u", "え": "e", "お": "o",
    "か": "ka", "き": "ki", "く": "ku", "け": "ke", "こ": "ko",
    "さ": "sa", "し": "shi", "す": "su", "せ": "se", "そ": "so",
    "た": "ta", "ち": "chi", "つ": "tsu", "て": "te", "と": "to",
    "な": "na", "に": "ni", "ぬ": "nu", "ね": "ne", "の": "no",
    "は": "ha", "ひ": "hi", "ふ": "fu", "へ": "he", "ほ": "ho",
    "ま": "ma", "み": "mi", "む": "mu", "め": "me", "も": "mo",
    "や": "ya", "ゆ": "yu", "よ": "yo",
    "ら": "ra", "り": "ri", "る": "ru", "れ": "re", "ろ": "ro",
    "わ": "wa", "ゐ": "wi", "うぇ": "we", "を": "wo", "ん": "n",
    "が": "ga", "ぎ": "gi", "ぐ": "gu", "げ": "ge", "ご": "go",
    "ざ": "za", "じ": "ji", "ず": "zu", "ぜ": "ze", "ぞ": "zo",
    "だ": "da", "ぢ": "ji", "づ": "zu", "で": "de", "ど": "do"
  };
  

  // Hiragana verisinin listeleri
  const hiraganaData = {
    "list1": [
      "あ", "い", "う", "え", "お",
      "か", "き", "く", "け", "こ",
      "さ", "し", "す", "せ", "そ",
      "た", "ち", "つ", "て", "と",
      "な", "に", "ぬ", "ね", "の",
      "は", "ひ", "ふ", "へ", "ほ",
      "ま", "み", "む", "め", "も",
      "や", "ゆ", "よ", "ら", "り",
      "わ", "ゐ", "う", "を", "ん",
      "が", "ぎ", "ぐ", "げ", "ご",
      "ざ", "じ", "ず", "ぜ", "ぞ",
      "だ", "ぢ", "づ", "で", "ど",
    ],
    "list2": [
      "は", "ひ", "ふ", "へ", "ほ",
      "ま", "み", "む", "め", "も",
      "や", "ゆ", "よ", "ら", "り",
      "わ", "ゐ", "うぇ", "を", "ん"
    ]
  };

  // Seçilen listeye göre hiragana listesini alma :)
  const fetchHiraganaList = () => {
    const selectedList  = hiraganaData[selectedPlan];
    

    if (selectedList) {
      setHiraganaList(selectedList.slice(0, 71));
    }
    
    
  };
   
  /*const handleDepolama = () => {
    localStorage.setItem('skor', clientScore);
    console.log("skor:", clientScore);
  };

  const handleOkuma = () => {
    const saklananIsim = localStorage.getItem('clientScore');
    if (saklananIsim) {
      setClientScore(saklananIsim);
      console.log("Yerel depolamada saklanan isim:", saklananIsim);
    } else {
      console.log("Yerel depolamada isim bulunamadı.");
    }
  }; */

  

  /*
  function scoreUp(i) {
    clientScore = clientScore + 1;
    console.log("Score:", clientScore);

  }
  */

  useEffect(() => {
    console.log("Mevcut Hiragana:", currentHiragana);
  }, [currentHiragana]);

  useEffect(() => {
    fetchHiraganaList();
  }, [selectedPlan]);


  // Butona tıklandığında
  const handleButtonClick = (selectedChar) => {
    setCurrentHiragana(selectedChar);  
    if (selectedChar === currentHiragana) {
      // Doğru cevap durumunda
      setClientScore(clientScore + 1);  
      generateAnswerOptions(); // Fonksiyonu buraya taşıyın
      console.log("Correct! \n Score: " + (clientScore + 1));
      localStorage.setItem('skor', clientScore + 1);  
      handleUpdateScore();
    } else {
      setAlertShow(true)
      setWrongMessageVisible(true);  
      setTimeout(() => setWrongMessageVisible(false), 1000); 
    }
  
  };


  // Cevap seçeneklerini oluşturma
  
  const generateAnswerOptions = () => {
    // hiraganaList kümesinden rastgele bir karakteri seç
    const randomIndex = Math.floor(Math.random() * hiraganaList.length);
    const randomHiragana = hiraganaList[randomIndex];
    // Şu anki hiragana karakterini güncelle
    setCurrentHiragana(randomHiragana);
  
    // Doğru cevabın index'ini belirle
    const correctIndex = Math.floor(Math.random() * 4);  
    // Yanlış cevapları seç
    const wrongAnswers = [...hiraganaList].filter((char, index) => index !== randomIndex).slice(0, 3);  
    // Tüm cevap seçeneklerini oluştur
    const answerOptions = [wrongAnswers[0], wrongAnswers[1], wrongAnswers[2], randomHiragana];  
    // Cevapları karıştır
    setAnswerOptions(answerOptions.sort(() => Math.random() - 0.5));  
  };

   
  function helo(){
    console.log("değişmeden:", sayiVal)
    setSayiVal(sayiVal + 1)
    if(sayiVal % 2 === 0){
      setHeloShow(true);
      console.log(sayiVal)
    }else if( sayiVal %2 != 0) {
      setHeloShow(false);
    }
    localStorage.removeItem('skor');

  }

 
   
  useEffect(() => {
    const saklananSkor = localStorage.getItem('skor');
    if (saklananSkor) {
      setClientScore(parseInt(saklananSkor)); //  Saklanan skoru sayıya dönüştürün
    }
  }, []);
  
 
 
  function handleBaslat(){ 
    generateAnswerOptions();
  }
  

 
 
  // Component'i döndür
  return (
    <div className='study-page'>
       
      <div className='header'>
         { /*<Form.Select aria-label="Liste secimi" onChange={(e) => setSelectedPlan(e.target.value)}>
          <option>Hiragana listesi sec</option>
          <option value="list1">Liste1: 10 Karakter</option>
          <option value="list2">Liste2: 20 Karakter</option>
          <option value="list3">Liste3: 30 Karakter</option>
          <option value="list4">Liste4: Tüm Karakter</option>


          </Form.Select>
        <h1>
          {selectedPlan ? `Secilen Calisma Plani: ${selectedPlan}` : "Seciniz..."}
        </h1>
        */ }
        <div className='list1 container'>
          <br />
          <center>
            <div className='navbar  ' style={{paddingBottom:"50px"}}>
              <div className='score-text' style={{fontSize:"48px"}}>
                Score: {clientScore}
              </div>
             
              <Player ></Player>
            
              </div>
              <br></br>
              <div >
            <div className='true-text '>
         
              <div> {/* Display https://vastseablog.com the romaji equivalent */}
                {hiraganaRomajiMapping[currentHiragana]}
              </div>
            </div>
            </div>
           
            <div className=''>
              <br></br>
            {alertShow && (
      <div className="score-text">
       {
       /*
<Alert variant="danger" onClose={() => setAlertShow(false)} dismissible>
          <Alert.Heading>Hatalı cevap</Alert.Heading>
          <h5>dogru cevabın "{currentHiragana}" olmalıydı</h5>
        </Alert>
       */
          } 
          {wrongMessageVisible && (
                    <div className="score-text " style={{fontSize:"48px"}}>Wrong</div>
                  )}
                  <br />
                </div>
              )}
            {heloShow && (
              <h3 className='score-text'>Helo!</h3>
            )}
              <br></br>
            <div className='diger-text'>
              {answerOptions.map((char, index) => (
                <button key={index} className='btn btn-danger' onClick={() => handleButtonClick(char)}>
                  <div className={`d${index + 1} d`}>
                    {char}
                  </div>
                </button>
              ))}
            </div>
            </div>
            <br></br>
         <div className='button-group'>
          <button className='btn-p'>
          <a className='t' style={{textDecoration:"none"}} href='/'>  <h1 className='t' style={{color:"white"}}>Geri</h1> </a>
          </button>
          <button className='btn-p' onClick={() => handleBaslat()}>
            <h1>helo</h1>
          </button>
        </div>
          </center>
        </div>
      </div>
    
    </div>
  );
};

export default Study;
