import React, { useEffect, useRef, useState } from "react";
import { Dimensions, Modal, ScrollView, StyleSheet, Text, View, TouchableOpacity, Alert, ToastAndroid } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { Divider, ProfileIcon } from "../../CommonComponent";
import Carousel, { ParallaxImage, Pagination } from 'react-native-snap-carousel';
import axiosInstance from "../../axiosInstance";
import { StackActions } from "@react-navigation/native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const renderItem = ({ item, index }, parallaxProps) => {
  return (
    <View style={styles.item}>
      <ParallaxImage
        source={{ uri: item }}
        containerStyle={styles.imageContainer}
        style={styles.image}
        parallaxFactor={0}
        {...parallaxProps}
      />
    </View>
  );
};

export default function DetailScreen({ navigation, route }: any) {

  const [index, setIndex] = useState(0);
  const [entries, setEntries] = useState([]);
  const carouselRef = useRef(null);
  useEffect(() => {
    axiosInstance.get(`/api/community?id=${route.params.id}`)
      .then(function (response) {
        setEntries(response.data.filePath);
      }).catch(function (error) {
        console.log(error);
      });
  }, []);
  const [modalVisible, setModalVisible] = useState(false);
  const [likes, setLikes] = useState(route.params.likes);
  const [focused, setFocused] = useState(false);
  const iconName: string = focused ? "flower" : "flower-outline";
  const likeEvent = () => {
    if (focused == false) {
      setFocused(!focused);
      setLikes((prevCount: number) => prevCount + 1);
    }
    else {
      setFocused(!focused);
      setLikes((prevCount: number) => prevCount - 1);
    }
  };
  const gotoEdit = () => {
    setModalVisible(!modalVisible);
    navigation.navigate('Edit', {
      id: route.params.id,
      category: route.params.category,
      images: entries,
      title: route.params.title,
      content: route.params.content,
    });
  };
  const deletePost = () => {
    Alert.alert('Warning', 'Do you want to delete post?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes',
        onPress: () => {
          setModalVisible(!modalVisible);
          axiosInstance.delete(`/api/community?id=${route.params.id}`)
            .then(function (response) {
              ToastAndroid.show("Deleted Successfully!", ToastAndroid.SHORT);
              navigation.dispatch(StackActions.popToTop);
            }).catch(function (error) {
              console.log(error);
            });
        }
      },
    ]);
  };

  return (
    <ScrollView>
      <Modal
        animationType="fade"
        transparent={true}
        statusBarTranslucent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableOpacity activeOpacity={0} onPress={() => setModalVisible(!modalVisible)} style={styles.overlay}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={gotoEdit}>
              <Text style={styles.modalText}>Edit</Text>
            </TouchableOpacity>
            <View style={{ width: "100%", height: 1, backgroundColor: "#eeeeee" }}></View>
            <TouchableOpacity onPress={deletePost}>
              <Text style={styles.modalText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <View style={styles.header}>
        <View style={styles.nicknameArea}>
          <ProfileIcon imagePath={null} />
          <Text style={styles.nicknameText}>{route.params.nickName}</Text>
        </View>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="menu-outline" size={40} color="black" />
        </TouchableOpacity>
      </View>

      <Carousel
        ref={carouselRef}
        sliderWidth={SCREEN_WIDTH}
        sliderHeight={SCREEN_WIDTH}
        itemWidth={SCREEN_WIDTH}
        data={entries}
        renderItem={renderItem}
        hasParallaxImages={true}
        onSnapToItem={(index) => setIndex(index)}
      />
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={index}
        containerStyle={styles.dotContainer}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={styles.inactiveDotStyle}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />

      <View style={styles.container}>
        <Text style={styles.title}>{route.params.title}</Text>
        <Divider />
        <Text>{route.params.content}</Text>
        <View style={styles.status}>
          <View style={styles.likes}>
            <TouchableOpacity onPress={() => likeEvent()}>
              <Ionicons name={iconName} size={30} color="black" style={{ marginRight: 5 }} />
            </TouchableOpacity>
            <Text>{/*{likes}*/} Likes</Text>
          </View>
          <View style={styles.comments}>
            <Ionicons name="chatbubble-ellipses-outline" size={30} color="black" style={{ marginRight: 5 }} />
            <Text>{/*{route.params.comments}*/} Comments</Text>
          </View>
        </View>
        <Text style={styles.date}>{route.params.createdDate}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  nicknameArea: {
    flexDirection: "row",
    alignItems: "center",
  },
  nicknameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
  },
  item: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
  },
  imageContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  dotContainer: {
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'black',
  },
  inactiveDotStyle: {
    backgroundColor: 'grey',
  },
  container: {
    padding: 10,
  },
  status: {
    flexDirection: "row",
    marginVertical: 15,
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  comments: {
    flexDirection: "row",
    alignItems: "center",
  },
  date: {
    color: "grey",
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: SCREEN_WIDTH,
    position: "absolute",
    bottom: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // padding: 20,
    alignItems: "center",
  },
  modalText: {
    fontSize: 20,
    width: SCREEN_WIDTH,
    textAlign: "center",
    paddingVertical: 15,
  },
});