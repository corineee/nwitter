//////Nweets 생성을 담당//////
import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { v4 as uuidv4 } from "uuid";
import { ref, uploadString } from "@firebase/storage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); //form을 위한 state이다.
  const [attachment, setAttachment] = useState("");
  const onSubmit = async (e) => {
    if (nweet === "") {
      return;
    }
    e.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); //npm i uuid는 어떤 특별한 식별자를 랜덤으로 생성해준다.
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      attachmentUrl = await response.ref.getDownloadURL();
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttachment("");
  };
  // try {
  //   const docRef = await addDoc(collection(dbService, "nweets"), {
  //     //pormise를 return하기 대문에 async함수를 사용
  //     text: nweet,
  //     createdAt: Date.now(),
  //     creatorId: userObj.uid,
  //   });
  //   console.log("Document written with ID: ", docRef.id);
  // } catch (error) {
  //   console.error("Error adding document: ", error);
  // }

  // setNweet("");
  const onChange = ({ target: { value } }) => {
    setNweet(value);
  };
  const onFileChange = (event) => {
    const {
      target: { files },
    } = event; //event안에서 target 안으로 가서 파일을 받아 오는 것이다.
    const theFile = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      //onloaded에 finishedEvent의 result를 setAttachment로 설정해줌
      console.log(finishedEvent);
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile); //readAsDataURL을 사용해서 파일을 읽는다.
  };
  const onClearAttachment = () => {
    setAttachment("");
  }; //올린 사진을 없앤다.

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input
          className="factoryInput__input"
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
        />
        <input type="submit" value="&rarr;" className="factoryInput__arrow" />
      </div>
      <label for="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />
      {attachment && (
        <div className="factoryForm__attachment">
          <img
            src={attachment}
            style={{
              backgroundImage: attachment,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearAttachment}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
};

export default NweetFactory;
