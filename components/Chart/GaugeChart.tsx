import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { useLanguageStore } from "@/store/useLanguageStore";
import { translations } from "@/constants/translations";

interface GaugeChartProps {
  total: number;
  used: number;
  left: number;
  damaged: number;
}

const { width } = Dimensions.get("window");
const CHART_WIDTH = width * 0.8;

export default function CustomGaugeChart({
  total,
  used,
  left,
  damaged,
}: GaugeChartProps) {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].charts.gaugeChart;

  const pieData = [
    { value: damaged, color: "#ff6b6b" },
    { value: left, color: "#51cf66" },
    { value: used, color: "#339af0" },
    { value: total - (used + left + damaged), color: "#f1f3f5" }, // Remaining space
  ];

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          data={pieData}
          donut
          semiCircle
          radius={CHART_WIDTH / 2}
          innerRadius={CHART_WIDTH / 2 - 30}
          centerLabelComponent={() => (
            <View style={styles.centerLabel}>
              <Text style={styles.totalLabel}>{t.total}</Text>
              <Text style={styles.totalValue}>
                {total} {t.units}
              </Text>
            </View>
          )}
        />
      </View>
      <View style={styles.legend}>
        <LegendItem color="#339af0" label={`${t.used}: ${used} ${t.units}`} />
        <LegendItem color="#51cf66" label={`${t.left}: ${left} ${t.units}`} />
        <LegendItem
          color="#ff6b6b"
          label={`${t.damaged}: ${damaged} ${t.units}`}
        />
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  chartContainer: {
    width: CHART_WIDTH,
    height: CHART_WIDTH / 2,
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    position: "absolute",
    alignItems: "center",
    top: CHART_WIDTH / 4 - 15, // Adjusted to center vertically in the semi-circle
  },
  totalLabel: {
    fontSize: 16,
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  totalValue: {
    fontSize: 24,
    fontFamily: "SFPro-Semibold",
    color: "#333",
  },
  legend: {
    marginTop: 20,
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
});
