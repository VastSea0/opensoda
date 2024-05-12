import React, { useState, useEffect } from 'react';
import './App.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileImage, faFilePdf, faFileWord, faFileExport, faDownload } from '@fortawesome/free-solid-svg-icons';

import { firestore, auth } from './firebase'; // Firebase'den firestore ve auth modüllerini içe aktarın

const FilesPage = () => {
    const [files, setFiles] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Firebase Authentication kullanarak oturum açmış olan kullanıcıyı alın
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                // Oturum açılmışsa, kullanıcıyı state'e kaydedin
                setUser(user);
            } else {
                // Oturum açılmamışsa, kullanıcıyı state'ten kaldırın
                setUser(null);
            }
        });

        // Aboneliği temizleyin
        return () => unsubscribe();
    }, []); // Effect, yalnızca bir kere çalıştırılsın ve bileşenin sıfırlanmasında temizlensin
   
    useEffect(() => {
        if (user) {
            const unsubscribe = firestore.collection('files').where('userId', '==', user.uid).orderBy('createdAt', 'desc').onSnapshot((snapshot) => {
                const files = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
                setFiles(files); 
            });

            return () => unsubscribe();
        }
    }, [user]);


    // Kullanıcı oturumu değiştiğinde dosyaları güncelle
    useEffect(() => {
        if (!user) {
            setFiles([]); // Oturum kapandığında dosyaları temizle
        }
    }, [user]);

    const handleDownload = (imageUrl, fileName) => {
        // Resmi indirme işlemini gerçekleştirin
        // Bu örnekte basit bir link oluşturuyorum, gerçek indirme işlemi için farklı bir yaklaşım gerekebilir
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const getFileIcon = (fileName) => {
        if (/\.(jpeg|jpg|png|gif)$/i.test(fileName)) {
            return <FontAwesomeIcon icon={faFileImage} size='3x' />;
        } else if (/\.(pdf)$/i.test(fileName)) {
            return <FontAwesomeIcon icon={faFilePdf} size='3x' />;
        } else if (/\.(doc|docx)$/i.test(fileName)) {
            return <FontAwesomeIcon icon={faFileWord} size='3x' />;
        } else {
            return <FontAwesomeIcon icon={faFileExport} size='3x' />;
        }
    };

    return (
        <div className="files-list">
            {files.length > 0 ? (
                files.map((file) => (
                    <div key={file.id} className="file-item">
                        {/\.(jpeg|jpg|png|gif)$/i.test(file.fileName) ? (
                            <img src={file.imageUrl} alt={file.fileName} className="file-preview" />
                        ) : (
                            <div className="file-icon">
                                {getFileIcon(file.fileName)}
                            </div>
                        )}
                        <div className="file-info">
                            <p>{file.fileName}</p>
                            <p>{file.createdAt.toDate().toLocaleString()}</p>
                            <button className='btn' onClick={() => handleDownload(file.imageUrl, file.fileName)}>

                                <FontAwesomeIcon icon={faDownload} size='3x' />
                            </button>
                        </div>
                    </div>
                ))
            ) : (
                <p>Dosyalar yok</p>
            )}
        </div>
    );
};

export default FilesPage;
/*
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