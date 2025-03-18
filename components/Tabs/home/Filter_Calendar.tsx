import { translations } from "@/constants/translations";
import { useLanguageStore } from "@/store/useLanguageStore";
import { Feather } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const CALENDAR_HEIGHT = SCREEN_HEIGHT * 0.45; // Adjusted for the calendar component
const FILTER_HEIGHT = SCREEN_HEIGHT * 0.5; // Adjusted for the filter component

interface FormatDate {
  (date: Date): string;
}

const formatDate: FormatDate = (date) => {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const suffix = (day: number): string => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${suffix(day)} ${month} ${year}`;
};

interface FilterSectionProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
  color: string;
  type: "priority" | "status" | "deadline";
}

const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  options,
  selected,
  onSelect,
  color,
  type,
}) => (
  <View style={styles.filterSection}>
    <Text style={styles.filterTitle}>{title}</Text>
    <View style={[styles.filterOptions, styles[`${type}Container`]]}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={[
            styles.filterButton,
            styles[`${type}Button`],
            selected === option && { backgroundColor: color },
            options.length === 2 && { width: "48%" },
          ]}
          onPress={() => onSelect(option)}
        >
          <Text
            style={[
              styles.filterButtonText,
              selected === option && styles.filterButtonTextActive,
            ]}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

interface FilterCalendarProps {
  type: "Home" | "Payment" | "Attendance"; // Add "Attendance" type
  home?: boolean;
}

const Filter_Calendar: React.FC<FilterCalendarProps> = ({ type, home }) => {
  const language = useLanguageStore((state) => state.language);
  const t = translations[language].tabs;

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false); // Ensure calendar is closed initially

  // Animation values for calendar and filter heights
  const calendarHeightAnim = useRef(new Animated.Value(0)).current; // Set initial value to 0
  const filterHeightAnim = useRef(new Animated.Value(0)).current;

  // Toggle calendar view
  const toggleCalendar = () => {
    Animated.timing(calendarHeightAnim, {
      toValue: isCalendarOpen ? 0 : CALENDAR_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsCalendarOpen(!isCalendarOpen);
    if (isFilterOpen) toggleFilter(); // Close filter if open
  };

  // Toggle filter view
  const toggleFilter = () => {
    Animated.timing(filterHeightAnim, {
      toValue: isFilterOpen ? 0 : FILTER_HEIGHT,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsFilterOpen(!isFilterOpen);
    if (isCalendarOpen) toggleCalendar(); // Close calendar if open
  };

  const markedDates = {
    [selectedDate.toISOString().split("T")[0]]: {
      selected: true,
      selectedColor: "#FFB800",
    },
  };

  const [filters, setFilters] = useState({
    priority: "High",
    status: "Completed",
    deadline: "Today",
  });

  const updateFilter = (category: string, value: string) => {
    setFilters((prev) => ({ ...prev, [category]: value }));
  };

  return (
    <View style={{ width: "100%" }}>
      <View style={styles.header}>
        <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
        <View style={styles.icons}>
          {home ? null : (
            <TouchableOpacity
              style={[
                styles.iconSpacing,
                isFilterOpen && styles.activeIconBackground,
                { marginRight: 0 },
              ]}
              onPress={toggleFilter}
            >
              <Feather
                name="filter"
                size={18}
                color={isFilterOpen ? "white" : "#8C8C8C"}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.iconSpacing,
              isCalendarOpen && styles.activeIconBackground,
            ]}
            onPress={toggleCalendar}
          >
            <Feather
              name="calendar"
              size={18}
              color={isCalendarOpen ? "white" : "#8C8C8C"}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Animated.View
        style={[styles.calendarContainer, { height: calendarHeightAnim }]}
      >
        <View style={styles.calendarContent}>
          <Calendar
            onDayPress={(day: { timestamp: number }) => {
              setSelectedDate(new Date(day.timestamp));
              toggleCalendar();
            }}
            markedDates={markedDates}
            theme={{
              backgroundColor: "#ffffff",
              calendarBackground: "#ffffff",
              textSectionTitleColor: "#b6c1cd",
              selectedDayBackgroundColor: "#FFB800",
              selectedDayTextColor: "#ffffff",
              todayTextColor: "#FFB800",
              dayTextColor: "#2d4150",
              textDisabledColor: "#d9e1e8",
              dotColor: "#FFB800",
              selectedDotColor: "#ffffff",
              arrowColor: "#FFB800",
              monthTextColor: "#2d4150",
              indicatorColor: "#FFB800",
              textDayFontFamily: "SFPro-Regular",
              textMonthFontFamily: "SFPro-Bold",
              textDayHeaderFontFamily: "SFPro-Medium",
              textDayFontSize: 16,
              textMonthFontSize: 18,
              textDayHeaderFontSize: 14,
            }}
          />
        </View>
      </Animated.View>
      <Animated.View
        style={[styles.filterContainer, { height: filterHeightAnim }]}
      >
        {isFilterOpen && (
          <ScrollView
            onContentSizeChange={(contentWidth, contentHeight) => {
              Animated.timing(filterHeightAnim, {
                toValue: Math.min(contentHeight, FILTER_HEIGHT),
                duration: 300,
                useNativeDriver: false,
              }).start();
            }}
          >
            {type === "Home" ? (
              <>
                <FilterSection
                  title={t.priority}
                  options={[
                    t.filterOptions.high,
                    t.filterOptions.medium,
                    t.filterOptions.low,
                  ]}
                  selected={filters.priority}
                  onSelect={(value) => updateFilter("priority", value)}
                  color="#3498DB"
                  type="priority"
                />
                <FilterSection
                  title={t.status}
                  options={[
                    t.filterOptions.completed,
                    t.filterOptions.incomplete,
                  ]}
                  selected={filters.status}
                  onSelect={(value) => updateFilter("status", value)}
                  color="#2ECC71"
                  type="status"
                />
                <FilterSection
                  title={t.deadline}
                  options={[
                    t.filterOptions.today,
                    t.filterOptions.tomorrow,
                    t.filterOptions.thisWeek,
                    t.filterOptions.nextWeek,
                  ]}
                  selected={filters.deadline}
                  onSelect={(value) => updateFilter("deadline", value)}
                  color="#F1C40F"
                  type="deadline"
                />
              </>
            ) : type === "Payment" ? (
              <FilterSection
                title={t.status}
                options={[t.filterOptions.expense, t.filterOptions.boost]}
                selected={filters.status}
                onSelect={(value) => updateFilter("status", value)}
                color="#3498DB"
                type="priority"
              />
            ) : type === "Attendance" ? (
              <FilterSection
                title={t.deadline}
                options={[
                  t.filterOptions.today,
                  t.filterOptions.yesterday,
                  t.filterOptions.thisWeek,
                  t.filterOptions.previousWeek,
                ]}
                selected={filters.deadline}
                onSelect={(value) => updateFilter("deadline", value)}
                color="#F1C40F"
                type="deadline"
              />
            ) : null}
          </ScrollView>
        )}
      </Animated.View>
    </View>
  );
};

export default Filter_Calendar;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateText: {
    fontSize: 16,
    color: "#1E1E1E",
    fontFamily: "SFPro-Semibold",
  },
  icons: {
    flexDirection: "row",
  },
  iconSpacing: {
    marginLeft: 10,
    backgroundColor: "#F4F4F4",
    padding: 8,
    borderRadius: 30,
  },
  calendarContainer: {
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: 12,
  },
  calendarContent: {
    height: CALENDAR_HEIGHT,
  },
  filterContainer: {
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: 12,
    marginTop: 10,
    paddingHorizontal: 5,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    marginBottom: 8,
    fontFamily: "SFPro-Semibold",
    color: "#333",
  },
  filterOptions: {
    flexDirection: "row",
  },
  priorityContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  statusContainer: {
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "space-between",
  },
  deadlineContainer: {
    flexDirection: "column",
  },
  priorityButton: {
    width: (SCREEN_WIDTH - 120) / 3,
  },
  statusButton: {
    width: SCREEN_WIDTH * 0.4 - 16,
  },
  deadlineButton: {
    width: "100%",
  },
  filterButton: {
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginRight: 8,
    marginBottom: 8,
    alignItems: "center",
    gap: 8,
  },
  filterButtonText: {
    color: "#333",
    fontSize: 12,
    fontFamily: "SFPro-Medium",
  },
  filterButtonTextActive: {
    color: "white",
  },
  activeIconBackground: {
    backgroundColor: "#8C8C8C",
  },
});
