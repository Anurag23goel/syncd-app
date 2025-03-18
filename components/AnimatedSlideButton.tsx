import React, { useCallback } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  interpolate,
  Extrapolate,
  interpolateColor,
  useAnimatedReaction,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const BUTTON_WIDTH = width - 40;
const BUTTON_HEIGHT = 50;
const BUTTON_PADDING = 10;
const SWIPEABLE_DIMENSIONS = BUTTON_HEIGHT - 2 * BUTTON_PADDING;
const H_WAVE_RANGE = SWIPEABLE_DIMENSIONS + 2 * BUTTON_PADDING;
const H_SWIPE_RANGE = BUTTON_WIDTH - 2 * BUTTON_PADDING - SWIPEABLE_DIMENSIONS;

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

interface AnimatedSlideButtonProps {
  onToggle: () => void;
  slideText?: string;
  completedText?: string;
}

const AnimatedSlideButton: React.FC<AnimatedSlideButtonProps> = ({
  onToggle,
  slideText = "Slide to dive in",
  completedText = "Let's go!",
}) => {
  const X = useSharedValue(0);
  const isToggleActivated = useSharedValue(false);
  const navigation = useNavigation();

  const handleToggle = useCallback(() => {
    if (!isToggleActivated.value) {
      isToggleActivated.value = true;
      onToggle();

      // Reset the slide position after a short delay
      setTimeout(() => {
        X.value = withSpring(0);
        isToggleActivated.value = false;
      }, 1000);
    }
  }, [onToggle, isToggleActivated, X, navigation]);

  const animatedGestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    { x: number }
  >({
    onStart: (_, ctx) => {
      ctx.x = X.value;
    },
    onActive: (event, ctx) => {
      X.value = Math.max(
        0,
        Math.min(ctx.x + event.translationX, H_SWIPE_RANGE)
      );
    },
    onEnd: () => {
      if (X.value < BUTTON_WIDTH / 2 - SWIPEABLE_DIMENSIONS / 2) {
        X.value = withSpring(0);
      } else {
        X.value = withSpring(H_SWIPE_RANGE);
      }
    },
  });

  useAnimatedReaction(
    () => X.value === H_SWIPE_RANGE,
    (isAtEnd, previous) => {
      if (isAtEnd && !previous) {
        runOnJS(handleToggle)();
      }
    },
    [handleToggle]
  );

  const InterpolateXInput = [0, H_SWIPE_RANGE];
  const AnimatedStyles = {
    swipeCont: useAnimatedStyle(() => {
      const backgroundColor = interpolateColor(
        X.value,
        [0, H_SWIPE_RANGE],
        ["#E8E8E8", "#002D62"]
      );
      return { backgroundColor };
    }),
    colorWave: useAnimatedStyle(() => {
      return {
        width: H_WAVE_RANGE + X.value,
        opacity: interpolate(X.value, InterpolateXInput, [0, 1]),
      };
    }),
    swipeable: useAnimatedStyle(() => {
      return {
        backgroundColor: "#002D62",
        transform: [{ translateX: X.value }],
      };
    }),
    swipeText: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [1, 0],
          Extrapolate.CLAMP
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, -BUTTON_WIDTH],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    }),
    arrowIcon: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [1, 0],
          Extrapolate.CLAMP
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [0, -SWIPEABLE_DIMENSIONS],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    }),
    checkIcon: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [0, 1],
          Extrapolate.CLAMP
        ),
        transform: [
          {
            scale: interpolate(
              X.value,
              InterpolateXInput,
              [0, 1],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    }),
    letsGoContainer: useAnimatedStyle(() => {
      return {
        opacity: interpolate(
          X.value,
          InterpolateXInput,
          [0, 1],
          Extrapolate.CLAMP
        ),
        transform: [
          {
            translateX: interpolate(
              X.value,
              InterpolateXInput,
              [BUTTON_WIDTH, 0],
              Extrapolate.CLAMP
            ),
          },
        ],
      };
    }),
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={animatedGestureHandler}>
        <Animated.View style={[styles.swipeCont, AnimatedStyles.swipeCont]}>
          <Animated.View style={[styles.colorWave, AnimatedStyles.colorWave]} />
          <Animated.View style={[styles.swipeable, AnimatedStyles.swipeable]}>
            <AnimatedIonicons
              name="arrow-forward"
              size={20}
              color="#FFFFFF"
              style={[styles.icon, AnimatedStyles.arrowIcon]}
            />
            <AnimatedIonicons
              name="checkmark-circle"
              size={32}
              color="#FFFFFF"
              style={[styles.icon, AnimatedStyles.checkIcon]}
            />
          </Animated.View>
          <Animated.Text style={[styles.swipeText, AnimatedStyles.swipeText]}>
            {slideText}
          </Animated.Text>
          <Animated.View
            style={[styles.letsGoContainer, AnimatedStyles.letsGoContainer]}
          >
            <Text style={styles.letsGoText}>{completedText}</Text>
          </Animated.View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  swipeCont: {
    height: BUTTON_HEIGHT,
    width: BUTTON_WIDTH,
    backgroundColor: "#E8E8E8",
    borderRadius: BUTTON_HEIGHT / 2,
    padding: BUTTON_PADDING,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
  colorWave: {
    position: "absolute",
    left: 0,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT / 2,
    backgroundColor: "#002D62",
  },
  swipeable: {
    position: "absolute",
    left: BUTTON_PADDING,
    height: SWIPEABLE_DIMENSIONS,
    width: SWIPEABLE_DIMENSIONS,
    borderRadius: SWIPEABLE_DIMENSIONS / 2,
    zIndex: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  swipeText: {
    alignSelf: "center",
    fontSize: 16,
    color: "#1B1B1B",
    fontFamily: "SFPro-Bold",
    zIndex: 2,
  },
  letsGoContainer: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  letsGoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "SFPro-Bold",
  },
  icon: {
    position: "absolute",
  },
});

export default AnimatedSlideButton;
