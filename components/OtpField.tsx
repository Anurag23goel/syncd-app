import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View, StyleSheet } from "react-native";
import { moderateScale } from "@/utils/spacing";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface OtpInputFieldProps {
  setPinReady: (ready: boolean) => void;
  code: string[];
  setCode: (code: string[]) => void;
  maxLength: number;
  handleChange: (name: string, value: string) => void;
  handleSend: () => void;
}

const OtpInputField: React.FC<OtpInputFieldProps> = ({
  setPinReady,
  code,
  setCode,
  maxLength,
  handleChange,
  handleSend,
}) => {
  const [inputContainerIsFocused, setInputContainerIsFocused] = useState(false);
  const textInputRef = useRef<TextInput>(null);
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].auth;

  useEffect(() => {
    setPinReady(code.length === maxLength);
    return () => setPinReady(false);
  }, [code]);

  useEffect(() => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  }, []);

  const handleOnPress = () => {
    setInputContainerIsFocused(true);
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const handleTextChange = (text: string) => {
    const updatedCode = text.split("");
    setCode(updatedCode);
    handleChange("code", text);
  };

  const codeDigitsArray = new Array(maxLength).fill(0);

  const toCodeDigitInput = (_value: number, index: number) => {
    const emptyInputChar = " ";
    const digit = code[index] || emptyInputChar;
    const isCurrentDigit = index === code.length;
    const isLastDigit = index === maxLength - 1;
    const isCodeFull = code.length === maxLength;

    const isDigitFocused = isCurrentDigit || (isLastDigit && isCodeFull);

    return (
      <View
        key={index}
        style={[
          styles.digitContainer,
          inputContainerIsFocused && isDigitFocused
            ? styles.digitFocused
            : styles.digitBlurred,
        ]}
      >
        <Text style={styles.digitText}>{digit}</Text>
      </View>
    );
  };

  return (
    <View>
      <Pressable onPress={handleOnPress} style={styles.pressable}>
        {codeDigitsArray.map(toCodeDigitInput)}
      </Pressable>
      <TextInput
        keyboardType="number-pad"
        style={styles.hiddenInput}
        maxLength={maxLength}
        value={code.join("")}
        onChangeText={handleTextChange}
        ref={textInputRef}
        onBlur={() => setInputContainerIsFocused(false)}
        onFocus={() => setInputContainerIsFocused(true)}
        onSubmitEditing={handleSend}
        returnKeyType="done"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  pressable: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  digitContainer: {
    width: moderateScale(45), // Increased width for larger input boxes
    height: moderateScale(50), // Increased height for larger input boxes
    justifyContent: "center",
    alignItems: "center",
    borderRadius: moderateScale(8),
    marginHorizontal: moderateScale(4),
    borderWidth: 1,
    borderColor: "#6B6B6B50",
  },
  digitFocused: {
    backgroundColor: "#F0F0F0", // Lighter background for focus
    borderColor: "#6B6B6B", // Blue color for focused state
  },
  digitBlurred: {
    backgroundColor: "#FFFFFF",
    borderColor: "#E0E0E0",
  },
  digitText: {
    fontSize: moderateScale(18),
    color: "#1A1A1A",
    fontFamily: "SFPro-Bold",
  },
  hiddenInput: {
    position: "absolute",
    top: 0,
    left: 0,
    height: moderateScale(50),
    width: moderateScale(300),
    opacity: 0,
  },
});

export default OtpInputField;
