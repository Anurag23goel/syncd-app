import React from "react";
import { View, StyleSheet } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

export const BarChartExample = () => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].charts.barChart;

  const data = [
    { value: 3, label: t.months.jan, frontColor: "green" },
    { value: 1, label: t.months.jan, frontColor: "red" },

    { value: 15, label: t.months.feb, frontColor: "green" },
    { value: 8, label: t.months.feb, frontColor: "red" },

    { value: 10, label: t.months.mar, frontColor: "green" },
    { value: 5, label: t.months.mar, frontColor: "red" },

    { value: 18, label: t.months.apr, frontColor: "green" },
    { value: 11, label: t.months.apr, frontColor: "red" },

    { value: 7, label: t.months.may, frontColor: "green" },
    { value: 3, label: t.months.may, frontColor: "red" },
  ];

  const yAxisLabels = ["0", "5", "10", "15", "20"].map(
    (value) => `${t.prefix}${value}${t.suffix}`
  );

  return (
    <View style={styles.container}>
      <BarChart
        data={data}
        barWidth={28}
        noOfSections={5}
        yAxisTextStyle={{ color: "#8e8e8e", fontSize: 12 }}
        yAxisLabelPrefix={t.prefix}
        yAxisLabelSuffix={t.suffix}
        yAxisLabelTexts={yAxisLabels}
        xAxisLabelTextStyle={{
          color: "#4a4a4a",
          fontSize: 12,
          fontWeight: "600",
        }}
        hideRules
        showVerticalLines={false}
        barBorderRadius={6}
        initialSpacing={15}
        spacing={30}
        backgroundColor="#fff"
        yAxisThickness={0}
        xAxisThickness={0}
        labelWidth={50}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    flex: 1,
    overflow: "hidden",
  },
});
