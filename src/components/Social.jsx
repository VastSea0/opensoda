import React, { useState, useEffect, useRef } from "react";
import Header from "./Header";
import "../styles/Zirve.css";
import { Row } from "react-bootstrap";
import { firestore, auth, firebase } from '../firebase/firebase';
import { Modal, Button } from "react-bootstrap";

const SocialPage = () => {
    const textareaRef = useRef(null);
    const [clientScore, setClientScore] = useState(1);
    const [user, setUser] = useState(null);
    const [usersData, setUsersData] = useState([]);
    const [userName, setUserName] = useState("");
    const [commentText, setCommentText] = useState("");
    const [ showCommentModal, setShowCommentModal] = useState(false); 
    const handleCloseCommantModal = () => setShowCommentModal(false);
    const [comments, setComments] = useState([]);

    const handleShowCommentModal = async (postId) => {
        const comments = await fetchCommentsForPost(postId);
        setComments(comments); // Yorumları bir state içinde saklayarak, bunları daha sonra kullanabilirsiniz
        setShowCommentModal(true); // Yorumları görüntülemek için modal'ı aç
    };
    

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUser(user);
                const userRef = firestore.collection('users').doc(user.uid);
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        setClientScore(userData.userScore);
                        setUserName(userData.displayName);
                    }
                });

            } else {
                setUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const usersRef = firestore.collection('posts');
        const unsubscribe = usersRef.onSnapshot((querySnapshot) => {
            const users = [];
            querySnapshot.forEach((doc) => {
                const userData = doc.data();
                users.push({
                    username: userData.displayName || doc.id,
                    text: userData.postText || "helo",
                    createdAt: userData.createdAt,
                    score: userData.score,
                    likes: userData.likes,
                    userId: userData.userId,
                    postId: userData.postId,
                });
            });
            setUsersData(users);
        });

        return () => unsubscribe();
    }, []);

    const addPost = async () => {
        const postText = textareaRef.current.value;
        if (!postText) return;

        const displayName = userName || 'Anonim';
        const userId = user.uid;
        const clientDate = new Date();
        const clientTimestamp = clientDate.toLocaleString()
        const browserInfo = navigator.userAgent;

        const docRef = firestore.collection('posts').doc();
        const postId = docRef.id;
        await docRef.set({
            postText,
            displayName,
            userId,
            score: clientScore,
            browserInfo: browserInfo,
            likes: 0,
            postId: postId,
            createdAt: clientTimestamp,
        });

        textareaRef.current.value = '';
    };

    const handleLikeClick = async (postId) => {
        const docRef = firestore.collection('posts').doc(postId);
        
        try {
            const docSnapshot = await docRef.get();
            if (!docSnapshot.exists) {
                console.error(`Belge bulunamadı: ${postId}`);
                return;
            }
    
            const likedUsersRef = docRef.collection('likedUsers').doc(user.uid);
            const likedUserSnapshot = await likedUsersRef.get();
    
            if (likedUserSnapshot.exists) {
                console.log("Bu kullanıcı zaten beğenmiş.");
                return;
            }
    
            // Kullanıcının beğendiğini işaretle
            await likedUsersRef.set({ 
                liked: true, 
                //username: user.username,
                //displayName: user.displayName,
            });
    
            // Beğenme sayısını artır
            await docRef.update({ likes: firebase.firestore.FieldValue.increment(1) });
        } catch (error) {
            console.error("Beğenirken bir hata oluştu:", error);
        }
    };

    const handleComment = async (postId, commentText) => {
        const docRef = firestore.collection('posts').doc(postId);
        
        try {
            const docSnapshot = await docRef.get();
            if (!docSnapshot.exists) {
                console.error(`Belge bulunamadı: ${postId}`);
                return;
            }
    
            const commentUsersRef = docRef.collection('commentUsers').doc(user.uid);
    
            // commentText değeri boşsa veya tanımsızsa, hata vermek yerine bir uyarı yazdırabiliriz
            if (!commentText) {
                console.warn("Yorum metni boş olamaz.");
                return;
            }
    
            const commentData = {
                comment: commentText,
                uid: user.uid,
                displayName: user.displayName  // Kullanıcının displayName değerini yorum koleksiyonuna ekle
            };
    
            // Kullanıcının yorum yaptığını işaretle
            await commentUsersRef.set(commentData);
    
            // Yorumları gönderi belgesine ekle
            await docRef.update({
                comments: firebase.firestore.FieldValue.arrayUnion(commentData) // Yorum verisini doğrudan ekleyin
            });
        } catch (error) {
            console.error("Yorum yaparken bir hata oluştu:", error);
        }
    };

    const fetchCommentsForPost = async (postId) => {
        const docRef = firestore.collection('posts').doc(postId).collection('commentUsers');
        const snapshot = await docRef.get();
    
        const comments = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            comments.push({
                displayName: data.displayName,
                comment: data.comment
            });
        });
    
        return comments;
    };
    
    
    
    
    
    
    const sortedUsersData = usersData.sort((a, b) => {
        // İki gönderinin skor ve beğeni toplamlarını hesapla
        const totalLikesA = a.likes + a.score;
        const totalLikesB = b.likes + b.score;
    
        // Önce toplam beğeni sayısına göre sırala (yüksekten düşüğe)
        if (totalLikesB !== totalLikesA) {
            return totalLikesB - totalLikesA;
        }
    
        // Toplam beğeni sayıları aynıysa, oluşturulma tarihine göre sırala (en yeni en üstte)
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
    
        // En yeni en üstte olacak şekilde sırala
        return dateB - dateA;
    });
    
    

    return(
<div>
  <Header />
  <div className="container">
    <h3>OpenSoda: Sosyal Topluluk</h3>
    <div className="post-form glass center">
      <div className="post-user">
        <h5>
          {user ? userName : <>Anonim</>}
        </h5>
        <h5 className="score-text">
          Score: {clientScore}
        </h5>
      </div>
      <textarea className="textarea" ref={textareaRef} />

      <button className="btn-p" onClick={addPost}>
        Gönderiyi Paylaş
      </button>
    </div>
    <br />
    <div className="posts">
      {sortedUsersData.map((postUser) => (
        <>
          <div className="post glass">
            <Row>
              <div className="post-user">
                <h5>{postUser.username}:</h5>
                <h5>{postUser.createdAt}</h5>
                <h5 className="score-text">{postUser.score}</h5>
                <h5 className="likes-text">{postUser.likes}</h5>
              </div>
            </Row>
            <div className="post-text">
              <p>{postUser.text}</p>
            </div>
            <div className="post-likes">
              <button className="btn-like" onClick={() => handleLikeClick(postUser.postId)}>
                Beğen
              </button>
              <button className="btn btn-disabled" disabled onClick={() => handleShowCommentModal()}>
                Yorum Yap
              </button>
              <Modal show={showCommentModal} onHide={handleCloseCommantModal} className="modal">
                <Modal.Header closeButton>
                  <Modal.Title>Yorumlar</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Yorumunuzu buraya girin"
                    rows={4}
                    cols={50}
                  />
                  <div className="comments-list">
                    <h5>Yorumlar üzerinde çalışıyorum yakında yorumları göreceksiniz</h5>
                    {comments.map((comment) => (
                      <p>
                        <strong>{comment.displayName}: </strong>
                        {comment.comment}
                      </p>
                    ))}
                  </div>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => handleComment(postUser.postId, commentText)}>
                    Yorumu Ekle
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </div>
          <br />
        </>
      ))}
    </div>
  </div>
  <div></div>
</div>

    )
}

export default SocialPage;