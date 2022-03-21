import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Modal,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Divider, ProfileIcon, mainStyle } from "../../CommonComponent";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import axiosInstance from "../../axiosInstance";

const screenWidth = Dimensions.get("window").width;

// 임시 데이터
const postInfo = {
  profileImage: require("../../../assets/profile_default.jpg"),
  nickname: "nickname",
  image: require("../../../assets/tori.jpg"),
  title: "titleeeeeeeeeee",
  contents: "contentssssssssss",
  postDate: "2022.2.27",
};

const emojiCollection = [
  {
    emoji: "😆",
    name: "emoticon1",
    id: 0,
  },
  {
    emoji: "😍",
    name: "emoticon2",
    id: 1,
  },
  {
    emoji: "🥳",
    name: "emoticon3",
    id: 2,
  },
  {
    emoji: "👍",
    name: "emoticon4",
    id: 3,
  },
  {
    emoji: "❤️",
    name: "emoticon5",
    id: 4,
  },
];

export default function ChallengeDetail({ route, navigation }: any) {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const challengeId = route.params.challengeId;
  const authorEmail = route.params.authorEmail;
  const [postData, setPostData] = useState({});
  const [cheering, setCheering] = useState<boolean>(false);
  const [userEmail, setUserEmail] = useState<String>("");
  const [cheeringId, setCheeringId] = useState();
  const [emojiListShow, setEmojiListShow] = useState(false);
  const [emojiCount, setEmojiCount] = useState({});
  const [emojiClicked, setEmojiClicked] = useState<boolean>(false);

  // 게시글 상세 정보 가져오기
  const getPostData = () => {
    axiosInstance
      .get(`/auth/challenge?id=${challengeId}`)
      .then(function (response) {
        setPostData(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 현재 유저, 작성자 간 cheering 데이터 가져오기
  const getCheeringData = async () => {
    const email = await AsyncStorage.getItem("email");
    setUserEmail(email);
    axiosInstance
      .get(`/auth/cheering/mycheer?myEmail=${email}&yourEmail=${authorEmail}`)
      .then(function (response) {
        setCheering(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 게시글의 이모티콘 데이터 가져오기
  const getEmojiData = () => {
    axiosInstance
      .get(`/auth/emoticon?challengeId=${challengeId}`)
      .then(function (response) {
        setEmojiCount(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    getPostData();
    getCheeringData();
    getEmojiData();
  }, []);

  // 챌린지 편집, 삭제 모달
  const handleEdit = () =>
    navigation.navigate("PostChallengeScreen", { postData, isCreate: false });
  const handleDelete = () => {
    console.log("delete");
    axiosInstance
      .delete(`/auth/challenge?id=${challengeId}`)
      .then(function (response) {
        navigation.navigate("ChallengeScreen");
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  function isCheeringId(element) {
    if (element.yourEmail == authorEmail) {
      return true;
    }
  }

  // 게시글 작성자 이메일로 cheering id 찾기
  const getCheeringId = () => {
    axiosInstance
      .get(`/auth/cheering/mycheer/list?userEmail=${userEmail}`)
      .then(function (response) {
        const cheering = response.data.find(isCheeringId);
        setCheeringId(cheering.id);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // cheering 취소
  const deleteCheering = () => {
    getCheeringId();
    axiosInstance
      .delete(`/auth/cheering?id=${cheeringId}`)
      .then(function (response) {
        setCheering(false);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // cheering 설정
  const postCheering = () => {
    axiosInstance
      .post(`/auth/cheering`, { myEmail: userEmail, yourEmail: authorEmail })
      .then(function (response) {
        setCheering(true);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  // 이모티콘 클릭 시 설정
  const handleEmojiClicked = (emoji) => {
    setEmojiClicked(true);

    let emojiCountSample = emojiCount;
    let emojiName = emoji.name;
    emojiCountSample[emojiName]++;
    setEmojiCount(emojiCountSample);
    setEmojiListShow(false);

    axiosInstance
      .post(`/auth/emoticon`, {
        challengeId: challengeId,
        email: authorEmail,
        emoticonName: emojiName,
      })
      .then(function (response) {})
      .catch(function (error) {
        console.log(error);
      });
  };

  // 이모티콘 관련 view
  const EmojiContainer = () => {
    return (
      <View style={styles.emojiContainer}>
        <TouchableOpacity onPress={() => setEmojiListShow(!emojiListShow)}>
          <Ionicons
            style={{ marginLeft: 10, paddingTop: 5 }}
            name="md-heart-sharp"
            size={24}
            color={emojiClicked ? "red" : "lightgrey"}
          />
        </TouchableOpacity>
        {emojiListShow ? (
          <View style={styles.emojiList}>
            {emojiCollection.map((emoji, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => handleEmojiClicked(emoji)}
              >
                <Text style={{ fontSize: 24, marginHorizontal: 5 }}>
                  {emoji.emoji}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    );
  };

  // 게시글 응원 관련 view
  const CheeringAuthor = () => (
    <TouchableOpacity
      onPress={() => {
        cheering ? deleteCheering() : postCheering();
      }}
    >
      <Text
        style={{
          ...styles.nicknameText,
          color: cheering ? "orange" : "lightgrey",
        }}
      >
        Cheering
      </Text>
    </TouchableOpacity>
  );

  // 종류별 이모지 개수 표시
  const ShowEmojiCount = () => (
    <View style={{ flexDirection: "row" }}>
      {emojiCollection.map((emoji, idx) =>
        emojiCount[emoji.name] == 0 ? null : (
          <View key={idx} style={styles.emojiView}>
            <Text>{emoji.emoji}</Text>
            <Text style={{ marginLeft: 5 }}>{emojiCount[emoji.name]}</Text>
          </View>
        )
      )}
    </View>
  );

  return (
    <ScrollView style={{ ...mainStyle.mainView, paddingHorizontal: 0 }}>
      <View style={styles.topBar}>
        <View style={styles.topProfile}>
          <ProfileIcon imagePath={postInfo.profileImage} />
          <Text style={styles.nicknameText}>
            {postData.uid == null ? null : postData.uid.nickName}
          </Text>
          <CheeringAuthor />
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="menu-outline" size={40} color="black" />
        </TouchableOpacity>
        <Modal
          animationType="fade"
          transparent={true}
          statusBarTranslucent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <TouchableOpacity
            activeOpacity={0}
            onPress={() => setModalVisible(!modalVisible)}
            style={styles.overlay}
          >
            <View style={styles.modalView}>
              <TouchableOpacity onPress={handleEdit}>
                <Text style={styles.modalText}>Edit</Text>
              </TouchableOpacity>
              <Divider />
              <TouchableOpacity onPress={handleDelete}>
                <Text style={styles.modalText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
      <Image style={styles.detailImage} source={postInfo.image} />
      <View style={styles.post}>
        <View style={styles.postTop}>
          <Text style={styles.postTitle}>{postData.title}</Text>
          <View style={styles.emojiContainer}>
            <ShowEmojiCount />
            <EmojiContainer />
          </View>
        </View>
        <Divider />
        <Text>{postData.contents}</Text>
        <Text style={styles.createdDate}>{postData.createdDate}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  topBar: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
  },
  topProfile: {
    flexDirection: "row",
    alignItems: "center",
  },
  nicknameText: {
    fontWeight: "700",
    fontSize: 18,
    marginLeft: 10,
  },
  detailImage: {
    width: screenWidth,
    height: screenWidth,
  },
  post: {
    margin: 10,
  },
  postTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  date: {
    color: "grey",
    marginTop: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: screenWidth,
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    width: screenWidth,
    textAlign: "center",
    paddingVertical: 15,
  },
  postDate: {
    margin: 10,
    color: "grey",
    fontSize: 12,
  },
  createdDate: {
    marginTop: 30,
    fontSize: 10,
    color: "lightgrey",
  },
  emojiContainer: {
    flexDirection: "row",
    position: "relative",
  },
  emojiList: {
    position: "absolute",
    right: -5,
    bottom: 40,
    flexDirection: "row",
    padding: 10,
    borderRadius: 50,
    backgroundColor: "white",
    elevation: 2,
  },
  emojiView: {
    flexDirection: "row",
    backgroundColor: "white",
    marginHorizontal: 5,
    padding: 5,
    borderRadius: 20,
    elevation: 2,
  },
});
