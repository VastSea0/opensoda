import { useState, React, useEffect } from 'react';
import Header from "./Header";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ButtonP from "./ButtonPrimary";
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare,   faGear, faBell, faLanguage, faSignIn, } from '@fortawesome/free-solid-svg-icons';
import Login from './login';
import { firestore, auth } from '../firebase/firebase'; // Firebase'den firestore ve auth modüllerini içe aktarın
import RandomCat from './randomCat';
const HomePage = () => {
    const [pValue, setPValue] = useState(false);
    const [show, setShow] = useState(false);
    const [kelimeshow, setKelimeShow] = useState(false);
    const [kelimeCevirShow, setKelimeCevirShow] = useState(false);

    const [user, setUser] = useState(null);
    const [clientScore, setClientScore] = useState(1);  
    const [usersData, setUsersData] = useState([]);

    
   
  

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
   /* useEffect(() => {
        /*const saklananSkor = localStorage.getItem('skor');
        if (saklananSkor) {
          setClientScore(parseInt(saklananSkor));
        } 
        setClientScore(user.userScore)
      }, [clientScore]); */
    /*
 Buraya bir kaç tane not düşeceğim... 
 Projeyi geliştirmek isteyen kişiler ve benim için işe yarayacak

 Öncelikle 
    if (!userDoc.exists) {
        // Eğer yeni kullanıcı ise bilgilerini veri tabanına kaydet
        await userRef.set({
          displayName: user.displayName,
          email: user.email,
          userId: user.uid,
          browserInfo: browserInfo
          // buraya geri kalan bilgileri ekleyebilirsin
        });
      }
  
Yukarıda ki kod parçasında verdiğim gibi kullanıcının "uid" değerine veri tabanına ekliyoruz.
çünkü o kullanıcının belgesine erişmek istediğim zaman bunu kullanmamız gerecek...
ve yine kullanıcıya veri yazdırabilmek için... 
const handleVeriKaydet = async () => {
    if (user) {
      // Kullanıcının belgesine referans oluştur
      const userRef = firestore.collection('users').doc(user.uid);

      // Kaydetmek istediğiniz bilgileri hazırlayın
      const yeniBilgiler = {
        ekBilgi1: "Değer 1",
        ekBilgi2: "Değer 2",
        // ... Diğer ek bilgiler
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
 
 */
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    
     
    const handleKelimeClose = () => setKelimeShow(false);
    const handleKelimeShow = () => setKelimeShow(true);

    const handleKelimeCevirClose = () => setKelimeCevirShow(false);
    const handleKelimeCevirShow = () => setKelimeCevirShow(true);

    useEffect(() => {
        if(clientScore != 0 || clientScore != null){
            setPValue(true)
        }
    }, [])

    useEffect(() => {
        // `users` koleksiyonuna erişin
        const usersRef = firestore.collection('users');
      
        // Verileri alındığında yapılacaklar
        usersRef.get().then((querySnapshot) => {
          const users = []; // Kullanıcı verilerini tutacak dizi (mutasyonu önlemek için)
      
          // Her belge için kullanıcı bilgilerini işle
          querySnapshot.forEach((doc) => {
            const userData = doc.data();
            users.push({
              username: userData.displayName || doc.id, // Kullanıcı adı (varsa) yoksa belge kimliği
              score: userData.userScore || 0, // Skor (varsa) yoksa 0
            });
          });
      
          // Toplanan kullanıcı verilerini state'e aktarın
          setUsersData(users);
        });
      
        // Bu efekt sadece bir kere çalıştırılır (bağımlılık yok)
      }, []);

    // kullanıcı oturumu aktif değilse
    if(!user){
        return(<RandomCat></RandomCat>)
    }

    const sortedUsersData = usersData.sort((a, b) => b.score - a.score);

      
    return(
        <div className="homeApp">
             <Header></Header>
             <div className="content">
                <center >
                   
                     <div className="progress-table">
                     <div className="container mt-3">
                     <div className="row">
                            <div className="col-6 ">
                            <h3>Istatiklerin</h3>
                            <p>Su ana kadar yaptigin yuzdelik  dilim</p>
                            {user ? (<p> <b>Oturum Sahibi:</b> {user.displayName}</p>) : (<p>Oturum Açın</p>)}
                            </div>
                            <div className="col-6 ">
                            <div style={{ width: 128, height: 128 }}>
                                <CircularProgressbar  value={clientScore / 10}  text={ clientScore / 10} />
                            </div>
                            </div>
                            
                        </div>
                        </div>
                     </div>
                     <div className="study  ">
                    <div className="row"> 
                    <span className="st">
                    
                              
                    <FontAwesomeIcon icon={faLanguage} size='5x' style={{color: "#d94039",}} />


                    </span>
                    <span className="st">
                    
                              
                        <FontAwesomeIcon icon={faLanguage} size='5x' style={{color: "#d94039",}} />

 
                        </span>
                        <span className="st ">
                    
                     {user ? (<> <FontAwesomeIcon icon={faLanguage} size='5x' style={{color: "#d94039",}} /></>) : (<><FontAwesomeIcon icon={faSignIn} size='5x' style={{color: "#d94039",}} /> <Login /> </>)}
                     

                    </span>
                         
                    </div>
                    <div className="row">
                    <span className="st col">
                        <button   className='btn-p'  onClick={handleShow}>
                            <h1>
                                Hiragana Çalismaya Basla
                         

                            </h1>
                        </button>


                        </span>
                        <span className="st col">
                        <button   className='btn-p'  onClick={handleKelimeShow}>
                            <h1>
                                Kelime Çalismaya Basla
                            </h1>
                        </button>
                        

                        </span>
                        <span className="st col">
                        <button   className='btn-p'  onClick={handleKelimeCevirShow}>
                            <h1>
                                Kelime Cevirmeye Basla
                            </h1>
                        </button>
                        

                        </span>
                        
                    </div>
                        
                     </div>
                     <div className="table-div"> 
                        <h1 className='score-text'>Kullanıcı Skorları</h1>
                     <table> 
                        <thead>
                            <tr>
                            <th>Kullanıcı Adı</th>
                            <th>Skor</th>
                            </tr>
                        </thead>
                        <tbody>
                        <tbody>
  {sortedUsersData.map((user) => (
    <tr key={user.username}>
      <td>{user.username}</td>
      <td>: {user.score}</td>
    </tr>
  ))}
</tbody>
                        </tbody>
                        </table>
                     </div>
                     <div className=' footer table-div'>
                       <a href='/sosyal'>   <h3>Toplulugu ziyaret edin </h3> </a>
                        <h6 className='score-text'>Egehan KAHRAMAN tarafından sevgi ile ❤️</h6>

                     </div>

                     </center>
             </div>

             <Modal show={show} onHide={handleClose} className='modal'>
            <Modal.Header closeButton>
            <Modal.Title >
            Haydi Calisalim
           
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {
            pValue && (
                <>
                Cok iyi gidiyorsun! su an {clientScore} kere dogru cevap verdin!!   
                </> 
            )
           }
                 Japonca harflerinde kendini Quizler ile gelistirerek ogrenimine devam et!
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

      <Modal show={kelimeshow} onHide={handleKelimeClose} className='modal'>
            <Modal.Header closeButton>
            <Modal.Title >
            Haydi Calisalim
           
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {
            pValue && (
                <>
                Cok iyi gidiyorsun! 
                </> 
            )
           }
                  Sanırım artık kendini kelime calismaya hazir hissediyorsun!
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleKelimeClose}>
                Kapat
            </Button>
            <Button variant="primary" href='/calis/kelime' onClick={handleKelimeClose}>
            Calis
            </Button>
            </Modal.Footer>
      </Modal>

      <Modal show={kelimeCevirShow} onHide={handleKelimeCevirClose} className='modal'>
            <Modal.Header closeButton>
            <Modal.Title >
            Haydi Calisalim
           
            </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            {
            pValue && (
                <>
                Cok iyi gidiyorsun! 
                </> 
            )
           }
                  Sanırım artık kendini kelime calismaya hazir hissediyorsun!
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={handleKelimeCevirClose}>
                Kapat
            </Button>
            <Button variant="primary" href='/calis/kelime/ceviri' onClick={handleKelimeCevirClose}>
            Calis
            </Button>
            </Modal.Footer>
      </Modal>
      <br></br>
        </div>
    )
}

export default HomePage;