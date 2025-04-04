import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { PieChart } from "react-native-gifted-charts";
import { moderateScale } from "@/utils/spacing";
import { router } from "expo-router";
import { translations } from "@/constants/translations";
import { useLanguageStore } from "@/store/useLanguageStore";
import { InventoryData } from "@/types/NewApiTypes"; // Ensure correct path

interface Resource {
  name: string;
  type: string;
  used: number;
  total: number;
  id: string;
}

const GaugeChart = ({
  inventory,
}: {
  inventory: InventoryData | undefined;
}) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.inventory;

  const pieData = inventory?.stats
    ? [
        {
          value: inventory.stats.totalUsed || 0,
          color: "#007BFF",
          text: `${t.chart.used}: ${inventory.stats.totalUsed} ${t.chart.units}`,
        },
        {
          value:
            inventory.stats.totalAdded -
              (inventory.stats.totalUsed + inventory.stats.totalDamaged) || 0,
          color: "#27AE60",
          text: `${t.chart.left}: ${
            inventory.stats.totalAdded -
            (inventory.stats.totalUsed + inventory.stats.totalDamaged)
          } ${t.chart.units}`,
        },
        {
          value: inventory.stats.totalDamaged || 0,
          color: "#E74C3C",
          text: `${t.chart.damaged}: ${inventory.stats.totalDamaged} ${t.chart.units}`,
        },
        {
          value:
            Math.max(
              inventory.stats.totalAdded -
                (inventory.stats.totalUsed +
                  inventory.stats.totalDamaged +
                  inventory.stats.totalDamaged),
              0
            ) || 5, // Filler for semi-circle
          color: "#EFEFEF",
          text: "",
        },
      ]
    : [
        {
          value: 2,
          color: "#007BFF",
          text: `${t.chart.used}: 2 ${t.chart.units}`,
        },
        {
          value: 2,
          color: "#27AE60",
          text: `${t.chart.left}: 2 ${t.chart.units}`,
        },
        {
          value: 3,
          color: "#E74C3C",
          text: `${t.chart.damaged}: 3 ${t.chart.units}`,
        },
        { value: 5, color: "#EFEFEF", text: "" },
      ];

  const total = inventory?.stats.totalAdded || 12;

  return (
    <View style={styles.chartContainer}>
      <View style={styles.pieChartWrapper}>
        <PieChart
          data={pieData}
          donut
          semiCircle
          radius={140}
          innerRadius={100}
          innerCircleColor={"#fff"}
        />
        <View style={styles.centerTextContainer}>
          <Text style={styles.totalLabel}>{t.chart.total}</Text>
          <Text style={styles.totalValue}>{`${total} ${t.chart.units}`}</Text>
        </View>
      </View>
      <View style={styles.legend}>
        {pieData.slice(0, 3).map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.text}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default function InventoryScreen({
  inventory,
}: {
  inventory?: InventoryData;
}) {
  const [activeTab, setActiveTab] = useState("graph");
  const [showAll, setShowAll] = useState(false); // State to toggle full list
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].modal.inventory;

  // Calculate used quantities from transactions
  const calculateUsed = (inventoryId: string) => {
    return (
      inventory?.transactions
        ?.filter(
          (trx) =>
            trx.InventoryID === inventoryId && trx.TransactionType === "USED"
        )
        .reduce((sum, trx) => sum + (trx.Quantity || 0), 0) || 0
    );
  };

  const resources: Resource[] = inventory?.records?.length
    ? inventory.records.map((item) => ({
        name: item.ResourceName,
        type: item.Category,
        used: calculateUsed(item.InventoryID),
        total: item.TotalQuantity,
        id: item.InventoryID,
      }))
    : [
        {
          name: t.resource.name,
          type: t.resource.type,
          used: 10,
          total: 100,
          id: "1",
        },
        {
          name: t.resource.name,
          type: t.resource.type,
          used: 20,
          total: 100,
          id: "2",
        },
        {
          name: t.resource.name,
          type: t.resource.type,
          used: 30,
          total: 100,
          id: "3",
        },
        {
          name: t.resource.name,
          type: t.resource.type,
          used: 40,
          total: 100,
          id: "4",
        },
      ];

  const displayedResources = showAll ? resources : resources.slice(0, 2); // Show 2 initially or full list

  return (
    <View style={styles.container}>
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "graph" && styles.activeTab]}
          onPress={() => setActiveTab("graph")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "graph" && styles.activeTabText,
            ]}
          >
            {t.tabs.graph}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "list" && styles.activeTab]}
          onPress={() => setActiveTab("list")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "list" && styles.activeTabText,
            ]}
          >
            {t.tabs.list}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === "graph" ? (
        <GaugeChart inventory={inventory} />
      ) : (
        <ScrollView style={styles.listContainer}>
          {displayedResources.map((resource, index) => (
            <View
              key={index}
              style={styles.resourceItem}
              onTouchEnd={() => router.push(`/log/inventory/${resource.id}`)}
            >
              <View>
                <Text style={styles.resourceName}>{resource.name}</Text>
                <Text style={styles.resourceType}>({resource.type})</Text>
              </View>
              <Text style={styles.resourceQuantity}>
                {`${resource.used}/${resource.total} units`}
              </Text>
            </View>
          ))}
          {resources.length > 2 && (
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setShowAll(!showAll)}
            >
              <Text style={styles.toggleButtonText}>
                {showAll ? "Show Less" : "Show More"}
              </Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: moderateScale(16),
    borderRadius: moderateScale(12),
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#F2F2F7",
    borderRadius: moderateScale(8),
    padding: moderateScale(4),
    marginBottom: moderateScale(20),
  },
  tab: {
    flex: 1,
    paddingVertical: moderateScale(8),
    alignItems: "center",
    borderRadius: moderateScale(6),
  },
  activeTab: {
    backgroundColor: "#007AFF",
  },
  tabText: {
    fontSize: moderateScale(12),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  activeTabText: {
    color: "#fff",
  },
  chartContainer: {
    alignItems: "center",
    paddingVertical: moderateScale(20),
  },
  pieChartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  centerTextContainer: {
    position: "absolute",
    alignItems: "center",
    bottom: 0,
  },
  totalLabel: {
    fontSize: moderateScale(16),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  totalValue: {
    fontSize: moderateScale(24),
    color: "#000",
    fontFamily: "SFPro-Bold",
  },
  legend: {
    marginTop: moderateScale(20),
    paddingHorizontal: moderateScale(16),
    width: "100%",
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: moderateScale(4),
  },
  legendDot: {
    width: moderateScale(12),
    height: moderateScale(12),
    borderRadius: moderateScale(6),
    marginRight: moderateScale(8),
  },
  legendText: {
    fontSize: moderateScale(14),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  listContainer: {
    flex: 1,
  },
  resourceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: moderateScale(16),
    backgroundColor: "#F7F7F7",
    paddingHorizontal: moderateScale(16),
    borderRadius: moderateScale(15),
    marginBottom: moderateScale(6),
  },
  resourceName: {
    fontSize: moderateScale(17),
    color: "#000",
    fontFamily: "SFPro-Semibold",
  },
  resourceType: {
    fontSize: moderateScale(14),
    color: "#666",
    marginTop: moderateScale(4),
    fontFamily: "SFPro-Regular",
  },
  resourceQuantity: {
    fontSize: moderateScale(15),
    color: "#666",
    fontFamily: "SFPro-Regular",
  },
  toggleButton: {
    alignItems: "center",
    paddingVertical: moderateScale(12),
    borderRadius: moderateScale(8),
  },
  toggleButtonText: {
    fontSize: moderateScale(16),
    color: "#007AFF",
    textDecorationLine: "underline",
    fontFamily: "SFPro-Regular",
  },
});
