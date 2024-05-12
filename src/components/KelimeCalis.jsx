// OpenSoda Projesi
// Yazar: Egehan KAHRAMAN
// Rota: /calis

import React, { useState, useEffect } from 'react';
import Form from "react-bootstrap/Form";
import Alert from 'react-bootstrap/Alert';
import Player from './Player';
import { auth, firebase, firestore } from '../firebase/firebase';

const KelimeCalis = () => {
  // Seçilen planın durumu ve setlenmesi :)
  const [selectedPlan, setSelectedPlan] = useState("list1");  // 60 Karakter
  // Hiragana listesinin durumu ve setlenmesisu
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
  // sayi  falan
  const [sayiVal, setSayiVal] = useState(1);
 
  // Oturum bilgilerini çek ve yaz
  const [user, setUser] = useState(null);

  // Hiragana karakterlerinin Romaji karşılıkları
  const hiraganaRomajiMapping = {
    "こんにちは": "konnichiwa(Merhaba)",
    "ありがとう": "Arigatō(Teşekkür ederim)",
    "すみません": "sumimasen(Üzgünüm)",
    "おはよう": "ohayō(Merhaba / Günaydın)",
    "さようなら": "sayōnara(Hoşça kal)",
    "いただきます": "itadakimasu(Yemeği yiyorum)",
    "すごい": "sugoi(Harika)",
    "おめでとう": "omedetō(Tebrikler)",
    "ありがとう": "arigatō(Teşekkür ederim)",
    "いいえ": "iie(Hayır)",
    "おやすみ": "oyasumi(Güle güle / İyi geceler)",
    "おばあさん": "obāsan(Büyükanne)",
    "すし": "sushi(Sushi)",
    "たべる": "taberu(Yemek yemek)",
    "うれしい": "ureshii(Mutlu)",
    "かわいい": "kawaii(Tatlı / Sevimli)",
    "はじめまして": "hajimemashite(Tanıştığımıza memnun oldum)",
    "あした": "ashita(Yarın)",
    "あさ": "asa(Sabah)",
    "おやつ": "oyatsu(Ara öğün)",
    "あいさつ": "aisatsu(Selamlaşma)",
    "げんき": "genki(İyiyim)",
    "げんきですか": "genki desu ka?(Nasılısın?)",
    "べんきょう": "benkyō(Çalışmak)",
    "がっこう": "gakkō(Okul)",
    "せんせい": "sensei(Öğretmen)",
    "ともだち": "tomodachi(Arkadaş)",
    "にほん": "nihon(Japonya)",
    "にほんご": "nihongo(Japonca)",
    "すき": "suki(Sevmek)",
    "すきです": "suki desu(Seviyorum)",
    "だいすき": "daisuki(Çok sevmek)",
    "すきな": "suki na(Sevdiğim)",
    "おうち": "ouchi(Ev)",
    "うえん": "uen(Park)",
    "あそぶ": "asobou(Oynamak)",
    "たべる": "taberu(Yemek)",
    "のむ": "nomu(İçmek)",
    "ねむる": "neru(Uyumak)",
    "みる": "miru(İzlemek)",
    "よむ": "yomu(Okumak)",
    "いく": "iku(Gitmek)",
    "くる": "kuru(Gelmek)",
    "ある": "aru(Var olmak)",
    "ない": "nai(Yok olmak)",
    "やさい": "yasai(Sebze)",
    "くだもの": "kudamono(Meyve)",
    "あめ": "ame(Şeker)",
    "かみ": "kami(Saç)",
    "あし": "ashi(Ayak)",
    "て": "te(El)",
    "め": "me(Göz)",
    "はな": "hana(Çiçek)",
    "みず": "mizu(Su)",
    "ひ": "hi(Güneş)",
    "つき": "tsuki(Ay)",
    "くも": "kumo(Bulut)",
    "とけい": "tokei(Saat)",
    "ねこ": "neko(Kedi)",
    "いぬ": "inu(Köpek)",
    "さかな": "sakana(Balık)",
    "いす": "isu(Sandalye)",
    "つくえ": "tsukue(Masa)",
    "ほん": "hon(Kitap)",
    "でんわ": "denwa(Telefon)",
    "あお": "ao(Mavi)",
    "あか": "aka(Kırmızı)",
    "しろ": "shiro(Beyaz)",
    "くろ": "kuro(Siyah)",
    "きいろ": "kiiro(Sarı)",
    "みどり": "midori(Yeşil)",
    "ちいさな": "chiisana(Küçük)",
    "おおきな": "ōkina(Büyük)",
    "すきな": "suki na(Favori)",
    "しあわせ": "shiawase(Mutluluk)",
    "かなしい": "kanashii(Üzgün)",
    "しんぱい": "shinpai(Endişeli)",
    "おいしい": "oishii(Lezzetli)",
    "たのしい": "tanoshii(Eğlenceli)",
    "うれしい": "ureshii(Mutlu)",
    "ふしぎ": "fushigi(Garip)",
    "きけん": "kiken(Tehlikeli)",
    "あぶない": "abunai(Tehlikeli)",
    "たいへん": "taihen(Zor)"
  };
  

  // Hiragana verisinin listeleri
  const hiraganaData = {
    "list1": [
      "こんにちは", "ありがとう", "すみません", "おはよう", "さようなら",
      "いただきます", "すごい", "おめでとう", "ありがとう", "いいえ",
      "おやすみ", "おばあさん", "すし", "たべる", "うれしい",
      "かわいい", "はじめまして", "あした", "あさ", "おやつ",
      "あいさつ", "げんき", "げんきですか", "べんきょう", "がっこう",
      "せんせい", "ともだち", "にほん", "にほんご", "すき",
      "すきです", "だいすき", "すきな", "おうち", "うえん",
      "あそぶ", "たべる", "のむ", "ねむる", "みる",
      "よむ", "いく", "くる", "ある", "ない", "こんにちは",
      "ありがとう", "すみません", "おはよう", "さようなら", "いただきます", "すごい",  "おめでとう",
      "ありがとう", "いいえ", "おやすみ", "おばあさん",  "すし",
      "たべる",  "うれしい",  "かわいい",  "はじめまして",  "あした",
      "あさ",  "おやつ",  "あいさつ",  "げんき",  "げんきですか","べんきょう",  "がっこう", "せんせい", "ともだち", "にほん", "にほんご","すき",
      "すきです",  "だいすき", "すきな", "おうち",
      "うえん", "あそぶ", "たべる", "のむ",
      "ねむる", "みる", "よむ",
      "いく", "くる", "ある","ない"
    ]
  };
  const elemanSayisi = Object.keys(hiraganaData.list1).length;
  console.log("Eleman Sayısı:", elemanSayisi);

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
  

  // Seçilen listeye göre hiragana listesini alma :)
  const fetchHiraganaList = () => {
    const selectedList  = hiraganaData[selectedPlan];
    

    if (selectedList) {
      setHiraganaList(selectedList.slice(0, 7));
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
  

  /*
  function scoreUp(i) {
    clientScore = clientScore + 1;
    console.log("Score:", clientScore);

  }
  */

  // Butona tıklandığında
  const handleButtonClick = (selectedChar) => {
    setCurrentHiragana(selectedChar);  
    if (selectedChar === currentHiragana) {
      // Doğru cevap durumunda
      setClientScore(clientScore + 1);  
      generateAnswerOptions();  
      console.log("Correct! \n Score: " + (clientScore + 1));
      localStorage.setItem('skor', clientScore + 1);  
      handleUpdateScore();
    }
    // Yanlış cevap durumunda
    if ( selectedChar !== currentHiragana) {
      setAlertShow(true)
      setWrongMessageVisible(true);  
      setTimeout(() => setWrongMessageVisible(false), 1000); 
    }
  
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

  // Seçilen plan değiştiğinde hiragana listesini güncelle
  useEffect(() => {
    fetchHiraganaList();
  }, [selectedPlan]);

  // Şu anki hiragana karakteri değiştiğinde
  useEffect(() => {
    console.log("Current Hiragana:", currentHiragana);
 
  }, [currentHiragana]);
  
  useEffect(() => {
    const saklananSkor = localStorage.getItem('skor');
    if (saklananSkor) {
      setClientScore(parseInt(saklananSkor)); // Saklanan skoru sayıya dönüştürün
    }
  }, []);
  

  // Şu anki hiragana karakteri değiştiğinde
  function handleBaslat(){ 
    generateAnswerOptions();
  };

  // Şu anki hiragana karakteri değiştiğinde
  useEffect(() => {
  }, [currentHiragana]);

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
            <div className='navbar'>
              <div className='score-text' style={{fontSize:"48px"}}>
                Score: {clientScore}
                 
              </div>
              <div className='score-text' style={{fontSize:"24px"}}>
                 
                Quiz kümesindeki kelime sayısı {elemanSayisi}
              </div>
              <Player></Player>
              <br></br>
              </div>
              <div>
            <div className='true-text-k '>
         
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
                  <div className={`k${index + 1} k`}>
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

export default KelimeCalis;
