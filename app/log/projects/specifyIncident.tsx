import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { LocalSvg } from "react-native-svg/css";
import FileItem from "@/components/Card/FileCard";
import DateTimePicker from "@react-native-community/datetimepicker";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";
import { router } from "expo-router";

interface Attachment {
  id: string;
  name: string;
  type: "doc" | "image";
  date: string;
}

interface NotifiedPerson {
  id: string;
  avatar: string;
  name: string;
}

export default function IncidentDetails({ onBack }: { onBack: () => void }) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.incident;
  const [location, setLocation] = useState("");
  const [number, setNumber] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  interface DateChangeEvent {
    type: string;
    nativeEvent: {
      timestamp: number;
    };
  }

  const onChangeDate = (
    event: DateChangeEvent,
    selectedDate?: Date | undefined
  ): void => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const attachments: Attachment[] = [
    { id: "1", name: "File Name", type: "doc", date: "2 hours ago" },
    { id: "2", name: "File Name", type: "image", date: "3 hours ago" },
  ];

  const notifiedPeople: NotifiedPerson[] = [
    { id: "1", avatar: "https://i.pravatar.cc/100?img=1", name: "Person 1" },
    { id: "2", avatar: "https://i.pravatar.cc/100?img=2", name: "Person 2" },
    { id: "3", avatar: "https://i.pravatar.cc/100?img=3", name: "Person 3" },
    { id: "4", avatar: "https://i.pravatar.cc/100?img=4", name: "Person 4" },
  ];

  const reporter = {
    avatar: "https://i.pravatar.cc/100?img=5",
    name: "Jane Cooper",
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#000" onPress={() => router.back()}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.title}</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.incidentDetail}</Text>
          <Text style={styles.detailText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            porttitor leo non culpa vitae accumsan. Integer et feugiat sem, ut
            rhoncus nisi. Cras porttitor leo id ut amet ultrices mi fringilla
            sit amet. Curabitur venenatis neque non ex vestibulum, et
            consectetur mauris commodo.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.damageDetail}</Text>
          <Text style={styles.detailText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            porttitor leo non culpa vitae accumsan. Aenean rhoncus elit nec
            ipsum pharetra tincidunt. Integer et feugiat sem.
          </Text>
        </View>

        <View style={styles.infoRow}>
          <TextInput
            placeholder={t.location}
            value={location}
            onChangeText={setLocation}
            style={styles.input}
          />
          <LocalSvg
            asset={require("../../../assets/images/location.svg")}
            width={20}
            height={20}
          />
        </View>

        <View style={styles.infoRow}>
          <TouchableOpacity onPress={() => setShowDatePicker(true)}>
            <Text style={styles.input}>{date.toDateString()}</Text>
          </TouchableOpacity>
          <Feather name="calendar" size={20} color="#666" />
        </View>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={onChangeDate}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 10,
            width: "100%",
          }}
        >
          <View style={styles.infoRow1}>
            <LocalSvg
              asset={require("../../../assets/images/affected.svg")}
              width={20}
              height={20}
            />
            <TextInput
              placeholder="Incident Number"
              value={number}
              onChangeText={setNumber}
              style={styles.input}
            />
          </View>
          <View style={styles.infoRow1}>
            <TextInput
              placeholder="Category Name"
              value={categoryName}
              onChangeText={setCategoryName}
              style={styles.input}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#000", fontSize: 20 }]}>
            Attachments
          </Text>
          <FileItem
            name="Audio File"
            date="Date"
            size="File size"
            iconType="audio"
          />
          <FileItem
            name="Video File"
            date="Date"
            size="File size"
            iconType="video"
            sharedWith={1}
          />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: "#000", fontSize: 20 }]}>
            Notified to
          </Text>
          <View style={styles.avatarRow}>
            {notifiedPeople.slice(0, 3).map((person, index) => (
              <Image
                key={index}
                source={{ uri: person.avatar }}
                style={[
                  styles.avatar,
                  {
                    transform: [{ translateX: -index * 12 }],
                    zIndex: 3 - index,
                  },
                ]}
              />
            ))}
            {notifiedPeople.length > 3 && (
              <View
                style={[
                  styles.moreAttendeesContainer,
                  { transform: [{ translateX: -3 * 12 }], zIndex: 0 },
                ]}
              >
                <Text style={styles.moreAttendeesText}>
                  +{notifiedPeople.length - 3}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text
            style={[styles.sectionTitle, { color: "#6B6B6B", fontSize: 20 }]}
          >
            Reported by
          </Text>
          <View style={styles.reporterContainer}>
            <Image
              source={{ uri: reporter.avatar }}
              style={styles.reporterAvatar}
            />
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.resolveButton}>
        <Text style={styles.resolveButtonText}>{t.resolve}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
  },
  backButton: {
    marginRight: moderateScale(16),
  },
  headerTitle: {
    fontSize: moderateScale(18),
    fontFamily: "SFPro-Semibold",
  },
  content: {
    flex: 1,
    padding: moderateScale(16),
  },
  section: {
    marginBottom: moderateScale(24),
  },
  sectionTitle: {
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
    marginBottom: moderateScale(8),
  },
  detailText: {
    fontSize: moderateScale(14),
    lineHeight: moderateScale(20),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(16),
    justifyContent: "space-between",
    borderWidth: 1,
    width: "100%",
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(8),
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  input: {
    paddingLeft: moderateScale(6),
    fontFamily: "SFPro-Regular",
  },
  infoRow1: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: moderateScale(16),
    gap: moderateScale(6),
    borderWidth: 1,
    width: "48%",
    borderRadius: moderateScale(10),
    paddingVertical: moderateScale(10),
    paddingHorizontal: moderateScale(8),
    borderColor: "#E0E0E0",
    backgroundColor: "#fff",
  },
  infoText: {
    marginLeft: moderateScale(8),
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  attachmentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  attachmentLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E3F2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: "500",
  },
  attachmentDate: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarContainer: {
    marginRight: -8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    borderWidth: 0.5,
    borderColor: "#fff",
  },
  moreAttendeesContainer: {
    backgroundColor: "#FFB800",
    borderRadius: 30,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  moreAttendeesText: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: "SFPro-Bold",
  },
  reporterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  reporterAvatar: {
    width: 40,
    height: 40,
    borderRadius: 30,
    marginRight: 8,
  },

  resolveButton: {
    backgroundColor: "#002B5B",
    margin: moderateScale(16),
    padding: moderateScale(16),
    borderRadius: moderateScale(8),
    alignItems: "center",
  },
  resolveButtonText: {
    color: "#fff",
    fontSize: moderateScale(16),
    fontFamily: "SFPro-Semibold",
  },
});
