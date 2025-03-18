import React, { useCallback } from "react";
import { View, Text, StyleSheet, Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "@/components/TouchableOpacity";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

const TermsScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].auth;

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleGoBack}
          accessibilityLabel={t.goBack}
          accessibilityHint="Navigates to the previous screen"
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>{t.termsTitle}</Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.contentText}>{termsAndConditions}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F2",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  backButton: {
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: "#000000",
    textAlign: "center",
    marginRight: 40, // To offset the back button and center the title
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 15,
    paddingBottom: 30,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "justify",
  },
});

const termsAndConditions = `
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam sollicitudin lacinia vulputate. Donec nunc quam, egestas sit amet dui nec, consectetur rutrum nisi. Nam tincidunt mauris a nibh ullamcorper, sed semper mi tristique. Aenean blandit justo nulla, quis vestibulum neque mollis sed. Fusce tempus tortor mauris, a pharetra lorem feugiat at.

Aliquam volutpat accumsan nisl commodo gravida. Ut gravida sapien nec dui porttitor rhoncus. Aenean convallis urna sit amet volutpat ultricies. Aliquam accumsan ipsum vitae nulla ultrices, nec tempus quam posuere. Curabitur viverra facilisis quam et volutpat. Fusce et tortor quis odio placerat lacinia ut nec urna.

Etiam quis maximus mi. Sed nisl magna, rutrum non tristique ut, bibendum ac purus. Sed porttitor lorem felis, quis elementum nibh elementum vitae. Integer faucibus tellus id sagittis tincidunt. Praesent velit ipsum, placerat in facilisis at, commodo eget nibh.

Nulla facilisi. Etiam facilisis turpis vitae ex tincidunt volutpat. Pellentesque in fringilla odio. Vestibulum id malesuada leo. Ut elementum lorem quam, at ultrices turpis fermentum id. Duis nec ante vehicula, accumsan nibh sit amet, suscipit nisi. Quisque ultrices quis velit quis dignissim.

Morbi iaculis, nulla vitae pharetra placerat, odio eros malesuada nisl, vel placerat augue velit et sapien. Sed malesuada tortor volutpat libero ultrices ornare.

Vestibulum in diam turpis. Morbi tempor eu ante accumsan interdum. Ut ac eleifend eros. Integer ac volutpat risus. Aenean tempus elementum ante a malesuada. Fusce id viverra odio. Curabitur in ante tincidunt, cursus odio hendrerit, posuere nibh.

Vestibulum felis metus, luctus non lacus ac, ultricies vestibulum magna. Nunc hendrerit dapibus libero a semper. Sed nisi velit, aliquam id nisl et, consectetur pellentesque ipsum. Curabitur semper nulla in erat lacinia, et condimentum erat scelerisque. Nunc vestibulum auctor mauris. Nam erat sem, ultricies ut egestas eget, facilisis eget mi.

Sed ut fermentum risus, id tempor ipsum. Sed id ultrices lectus. Donec elementum sem sed velit interdum ultricies. Integer auctor odio sed nisl varius rutrum. Morbi fringilla ultrices interdum. Suspendisse quis pharetra arcu. Curabitur mollis est sit amet tristique viverra.

Nullam ultrices ante quis turpis facilisis ultricies. Maecenas feugiat, erat faucibus pellentesque dictum, est risus aliquam ipsum, a scelerisque tortor magna eu lorem. Quisque consequat nibh lacus, vitae elementum erat cursus quis.

Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam pretium justo velit, in varius diam efficitur eget. In auctor nunc et dolor lobortis, sed viverra dui cursus. Sed facilisis nisl ac tristique semper. Quisque sem urna, consectetur tincidunt odio sit amet, feugiat egestas nunc.

Vestibulum ac mauris cursus, cursus tellus ullamcorper, consequat massa. Aenean malesuada id magna dictum fringilla. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Fusce dictum mauris sed libero pellentesque ullamcorper. Mauris mattis rutrum sem non luctus. Nulla ut lorem sed neque tempor molestie. Etiam in orci arcu.
`;

export default TermsScreen;
