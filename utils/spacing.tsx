import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("screen");

export const WIDTH = width;

export const HEIGHT = height;

const [shortDimension, longDimension] =
  width < height ? [width, height] : [height, width];

export const scale = (size: number) => {
  return (shortDimension / 360) * size;
};

export const scaleVertical = (size: number) => {
  return (longDimension / 640) * size;
};

export const scaledInPx = (size: number) => {
  return `${(shortDimension / 350) * size}px`;
};

export const verticalScale = (size: number, factor = 1) =>
  size + (scaleVertical(size) - size) * factor;

export const moderateScale = (size: number, factor = width > 800 ? 0.7 : 1) =>
  (size + (scale(size) - size)) * factor;

const scale_2 = scale(2);

const scale_4 = 2 * scale_2;

const scale_5 = scale(5);

const scale_8 = 2 * scale_4;

const scale_10 = 2 * scale_5;

const scale_12 = 3 * scale_4;

const scale_13 = scale(13);

const scale_14 = 7 * scale_2;

const scale_15 = 3 * scale_5;

const scale_16 = 2 * scale_8;

const scale_17 = scale_13 + scale_4;

const scale_18 = 9 * scale_2;

const scale_19 = scale_2 + scale_17;

const scale_20 = 5 * scale_4;

const scale_21 = scale_8 + scale_13;

const scale_23 = scale_10 + scale_13;

const scale_25 = 5 * scale_5;

const scale_26 = 2 * scale_13;

const scale_30 = 6 * scale_5;

const scale_35 = 7 * scale_5;

const scale_40 = 10 * scale_4;

const scale_50 = 10 * scale_5;

const scale_60 = 2 * scale_30;

const scale_80 = 20 * scale_4;

const scale_90 = 18 * scale_5;

const scale_100 = 20 * scale_5;

const scale_110 = scale_80 + scale_30;

const scale_120 = 24 * scale_5;

const scale_130 = 26 * scale_5;

const scale_140 = 28 * scale_5;

const scale_148 = 37 * scale_4;

const scale_150 = 30 * scale_5;

const scale_190 = scale_140 + scale_50;

const scale_200 = 4 * scale_50;

const scale_250 = 5 * scale_50;

const scale_320 = 8 * scale_40;

const scale_360 = 9 * scale_40;

const vscale_2 = moderateScale(2);

const vscale_3 = moderateScale(3);

const vscale_4 = moderateScale(4);

const vscale_5 = moderateScale(5);

const vscale_6 = vscale_2 * 3;

const vscale_7 = moderateScale(7);

const vscale_8 = 2 * vscale_4;

const vscale_10 = 2 * vscale_5;

const vscale_12 = 3 * vscale_4;

const vscale_13 = vscale_8 + vscale_5;

const vscale_15 = 3 * vscale_5;

const vscale_16 = 4 * vscale_4;

const vscale_20 = 5 * vscale_4;

const vscale_25 = 5 * vscale_5;

const vscale_30 = 6 * vscale_5;

const vscale_36 = 9 * vscale_4;

const vscale_40 = 10 * vscale_4;

const vscale_45 = 9 * vscale_5;

const vscale_60 = 12 * vscale_5;

const vscale_70 = 14 * vscale_5;

const vscale_80 = 20 * vscale_4;

const vscale_100 = 25 * vscale_4;

const vscale_150 = 15 * vscale_10;

const vscale_300 = 2 * vscale_150;

export const FONT_SIZE = {
  10: scale_10,
  12: scale_12,
  13: scale_13,
  14: scale_14,
  15: scale_15,
  16: scale_16,
  17: scale_17,
  18: scale_18,
  19: scale_19,
  21: scale_21,
  23: scale_23,
  25: scale_25,
  26: scale_26,
  30: scale_30,
  35: scale_35,
  40: scale_40,
  50: scale_50,
};

export const SPACE_HORIZONTAL = {
  2: scale_2,
  4: scale_4,
  5: scale_5,
  8: scale_8,
  10: scale_10,
  12: scale_12,
  15: scale_15,
  20: scale_20,
  30: scale_30,
  40: scale_40,
  50: scale_50,
  60: scale_60,
  80: scale_80,
  90: scale_90,
  100: scale_100,
  110: scale_110,
  120: scale_120,
  130: scale_130,
  140: scale_140,
  150: scale_150,
  190: scale_190,
  250: scale_250,
  200: scale_200,
  320: scale_320,
  360: scale_360,
};

export const SPACE_VERTICAL = {
  2: vscale_2,
  3: vscale_3,
  4: vscale_4,
  5: vscale_5,
  6: vscale_6,
  7: vscale_7,
  8: vscale_8,
  10: vscale_10,
  12: vscale_12,
  13: vscale_13,
  15: vscale_15,
  16: vscale_16,
  20: vscale_20,
  25: vscale_25,
  30: vscale_30,
  36: vscale_36,
  40: vscale_40,
  45: vscale_45,
  60: vscale_60,
  70: vscale_70,
  80: vscale_80,
  100: vscale_100,
  150: vscale_150,
  300: vscale_300,
};
