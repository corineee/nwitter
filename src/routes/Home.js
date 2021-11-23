import React, { useState, useEffect } from "react";
import {
  collection,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]);

  // useEffect(() => {
  //   dbService.collection("nweets").onSnapshot((snapshot) => {
  //     const nweetArray = snapshot.docs.map((doc) => ({
  //       id: doc.id,
  //       ...doc.data(),
  //     }));
  //     setNweets(nweetArray);
  //   });
  // }, []); 이전 방식이다.

  useEffect(() => {
    // 실시간으로 데이터를 데이터베이스에서 가져오기

    const q = query(
      collection(getFirestore(), "tweets"),
      // where('text', '==', 'hehe') // where뿐만아니라 각종 조건 이 영역에 때려부우면 됨
      orderBy("createdAt")
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const newArray = querySnapshot.docs.map((doc) => {
        //Snapshot은 기본적으로 데이터베이스에 무슨일이 있을경우 알림을 받는다.
        return {
          id: doc.id,
          ...doc.data(),
        };
      });
      setNweets(newArray);
      console.log("Current tweets in CA: ", newArray);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.createId === userObj.uid}
          /> //App.js로 부터 userObj를 받고 있기 때문에 누가 로그인 했는지 알수 있다.
        ))}
      </div>
    </div>
  );
};

export default Home;
