import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { useRouter } from "expo-router";

const GroupInfoScreen = () => {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].groupInfo;

  const groupDetails = {
    groupName: "Orion Towers",
    location: "Karnataka, Bengaluru, Koramangala",
    description:
      "A dedicated space for seamless communication, file sharing, and project updates related to the Orion Towers project.",
    createdBy: "Madhav",
    createdDate: "14/10/24",
    members: [
      {
        id: 1,
        name: "Aryan Singh",
        phone: "9876543210",
        image: "https://i.pravatar.cc/100?img=1",
      },
      {
        id: 2,
        name: "Neha Sharma",
        phone: "8765432109",
        image: "https://i.pravatar.cc/100?img=2",
      },
      {
        id: 3,
        name: "Rahul Kumar",
        phone: "7654321098",
        image: "https://i.pravatar.cc/100?img=3",
      },
      {
        id: 4,
        name: "Priya Patel",
        phone: "6543210987",
        image: "https://i.pravatar.cc/100?img=4",
      },
      {
        id: 5,
        name: "Vihaan Singh",
        phone: "4321098765",
        image: "https://i.pravatar.cc/100?img=5",
      },
    ],
  };

  const renderMember = ({
    item,
  }: {
    item: { id: number; name: string; phone: string; image: string };
  }) => (
    <View style={styles.memberRow}>
      <Image source={{ uri: item.image }} style={styles.memberImage} />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.name}</Text>
        <Text style={styles.memberPhone}>{item.phone}</Text>
      </View>
      <TouchableOpacity>
        <Feather name="phone" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.groupInfo}</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.groupHeader}>
          <Image
            source={require("../../assets/images/assets/image1.png")}
            style={styles.groupImage}
          />
          <Text style={styles.groupName}>{groupDetails.groupName}</Text>
          <Text style={styles.location}>{groupDetails.location}</Text>

          <View style={styles.descriptionContainer}>
            <Text style={styles.description}>{groupDetails.description}</Text>
            <Text style={styles.createdBy}>
              <Text>{t.createdBy} </Text>
              <Text>{groupDetails.createdBy}</Text>
              <Text>, </Text>
              <Text>{groupDetails.createdDate}</Text>
            </Text>
          </View>
        </View>

        {/* Action Buttons with improved styling */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="person-add-outline" size={20} color="#000" />
            <Text style={styles.actionButtonText}>{t.addMember}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="call-outline" size={20} color="#000" />
            <Text style={styles.actionButtonText}>{t.groupCall}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <AntDesign name="filetext1" size={20} color="#000" />
            <Text style={styles.actionButtonText}>{t.media}</Text>
          </TouchableOpacity>
        </View>

        {/* Members section with improved header */}
        <View style={styles.membersSection}>
          <Text style={styles.membersHeader}>
            <Text>{t.members}</Text>
            <Text>: </Text>
            <Text>{groupDetails.members.length}</Text>
          </Text>
          <FlatList
            data={groupDetails.members}
            renderItem={renderMember}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.membersList}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    paddingHorizontal: 16,
  },
  groupHeader: {
    alignItems: "flex-start",
    marginBottom: 10,
    marginTop: 10,
  },
  groupImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  groupName: {
    fontSize: 22,
    marginBottom: 5,
  },
  location: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SFPro-Regular",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "#6B6B6B",
    fontFamily: "SFPro-Regular",
    textAlign: "left",
    marginBottom: 10,
  },
  createdBy: {
    fontSize: 12,
    fontFamily: "SFPro-Regular",
    color: "#8C8C8C",
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 40,
    backgroundColor: "#EDEDED",
    marginHorizontal: 4,
  },
  actionButtonText: {
    fontSize: 12,
    marginTop: 5,
    fontFamily: "SFPro-Regular",
    color: "#6B6B6B",
  },
  membersHeader: {
    fontSize: 15,
    fontFamily: "SFPro-Regular",
    paddingHorizontal: 16,
    marginBottom: 10,
    color: "#8C8C8C",
  },
  membersList: {
    paddingHorizontal: 16,
  },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  memberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 16,
    fontFamily: "SFPro-Medium",
  },
  memberPhone: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "SFPro-Bold",
  },
  descriptionContainer: {
    backgroundColor: "#E0E0E0",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: "100%",
  },
  membersSection: {
    flex: 1,
    marginTop: 20,
  },
});

export default GroupInfoScreen;
