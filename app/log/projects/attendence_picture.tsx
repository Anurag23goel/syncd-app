import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const { width, height } = Dimensions.get("window");

export default function WorkerProfile() {
  const router = useRouter();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.attendance.picture;

  const data = {
    name: "Ravish Kumar",
    date: "18/02/24",
    project: "Orion heights",
    coordinates: "28.6129, 77.2295",
    takenBy: "(Account Name)",
  };

  const onBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="chevron-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{data.name}</Text>
        </View>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={require("../../../assets/images/attendee_picture.png")}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              style={styles.gradient}
            >
              <View style={styles.infoContainer}>
                <InfoRow label={t.name} value={data.name} />
                <InfoRow label={t.date} value={data.date} />
                <InfoRow label={t.project} value={data.project} />
                <InfoRow label={t.coordinates} value={data.coordinates} />
                <InfoRow label={t.takenBy} value={data.takenBy} />
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
      </SafeAreaView>
    </View>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}: </Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  safeArea: {
    flex: 1,
  },
  backgroundImage: {
    width: width,
    height: (3 / 4) * height,
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16),
  },
  backButton: {
    marginRight: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Bold",
    color: "#fff",
  },
  gradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: moderateScale(200),
    justifyContent: "flex-end",
  },
  infoContainer: {
    padding: moderateScale(16),
    backgroundColor: "#1F1F1FB2",
    borderRadius: moderateScale(9),
    width: "70%",
    marginBottom: moderateScale(10),
    marginLeft: moderateScale(10),
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: moderateScale(8),
  },
  label: {
    fontSize: moderateScale(14),
    color: "#fff",
    opacity: 0.8,
  },
  value: {
    fontSize: moderateScale(14),
    color: "#fff",
    fontFamily: "SFPro-Medium",
  },
});
