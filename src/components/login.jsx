import React, { useState } from 'react';
import { auth, firebase, firestore } from '../firebase/firebase';
import logo from "../Logo128.png";
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nick, setNick] = useState('');

  const handleLogin = async (e) => {
  e.preventDefault();
  try {
    // E-posta ve şifreyle giriş yap
    const result = await auth.signInWithEmailAndPassword(email, password);
    const user = result.user;

    // Kullanıcı giriş yaptığında yapılacak işlemler buraya gelebilir

    console.log("Giriş başarılı!");
  } catch (error) {
    // Eğer giriş yaparken hata alırsan, yeni bir kullanıcı oluşturmayı dene
    try {
      const newUser = await auth.createUserWithEmailAndPassword(email, password);
      const newUserResult = newUser.user;

      // Firestore'a yeni kullanıcı bilgilerini kaydet
      const newUserRef = firestore.collection('users').doc(newUserResult.uid);
      const browserInfo = navigator.userAgent;
      await newUserRef.set({
        displayName: nick,
        email: email,
        userId: newUserResult.uid,
        browserInfo: browserInfo,
        userPassword: password,
        userScore: 0
        // Diğer bilgileri buraya ekleyebilirsin
      });

      console.log("Yeni kullanıcı kaydedildi!");
    } catch (error) {
      console.error(error.message);
      // Hata durumunda hatayı göster
    }
  }
};
  

  const handleSignInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      // Google ile kayıt et
      const result = await auth.signInWithPopup(provider);
      const user = result.user;

      // Yeni kullanıcı mı yoksa hali hazırda kayıtlı mı kontrol et
      const userRef = firestore.collection('users').doc(user.uid);
      const userDoc = await userRef.get();
      const browserInfo = navigator.userAgent;

      if (!userDoc.exists) {
        // Eğer yeni kullanıcı ise bilgilerini veritabanına kaydet
        await userRef.set({
          displayName: user.displayName,
          email: user.email,
          userId: user.uid,
          browserInfo: browserInfo,
          userScore: 0
          // Diğer bilgileri buraya ekleyebilirsin
        });
      }

      // Kullanıcı giriş yaptığında yapılacak işlemler buraya gelebilir

    } catch (error) {
      console.error(error.message);
      // Hata durumunda hatayı göster
    }
  };

  return (
    <div>
      <div className='container'>
        <div className='row'>
          <Form onSubmit={(e) => handleLogin(e)} className='glass'>
            <img src={logo} alt="Logo"></img>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formGridEmail">
                <Form.Label>E-posta</Form.Label>
                <Form.Control type="email" placeholder="E-posta adresini gir" value={email} onChange={(e) => setEmail(e.target.value)} />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPassword">
                <Form.Label>Şifre</Form.Label>
                <Form.Control type="password" placeholder="Şifreni gir" value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
            </Row>
            <Form.Group as={Col} controlId="formGridNick">
              <Form.Label>Kullanıcı adı</Form.Label>
              <Form.Control type="text" placeholder="Kullanıcı adını gir" value={nick} onChange={(e) => setNick(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3" id="formGridCheckbox">
              <Form.Check type="checkbox" label="Koşulları okudum ve kabul ediyorum" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Kayıt ol ve devam et
            </Button>
          </Form>
        </div>
      </div>
      <h5 className=''>Veya</h5>
      <button style={{ color: "white" }} className='btn' onClick={handleSignInWithGoogle}>
        <h3>Google ile devam et (Bu yazıya tıkla)</h3>
      </button>
    </div>
  );
};

export default Login;
