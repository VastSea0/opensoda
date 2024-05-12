import React, { useState, useEffect } from 'react';
import { auth, firebase, firestore } from '../firebase/firebase';

const KullanıcıBilgisi = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Firebase Authentication kullanarak oturum açmış olan kullanıcıyı alın
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Otu rum açılmışsa, kullanıcıyı state'e kaydedin
        setUser(user);
      } else {
        // Oturum açılmamışsa, kullanıcıyı state'ten kaldırın
        setUser(null);
      }
    });

    // Aboneliği temizleyin
    return () => unsubscribe();
  }, []); // Effect, yalnızca bir kere çalıştırılsın ve bileşenin sıfırlanmasında temizlensin

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

  return (
    <div>
      {user && (
        <div>
          <h2>Kullanıcı Bilgileri</h2>
          <p>Kullanıcı Adı: {user.displayName}</p>
          <p>Email: {user.email}</p>

          <button onClick={handleVeriKaydet}>Veri Kaydet</button>
        </div>
      )}
    </div>
  );
};

export default KullanıcıBilgisi;
