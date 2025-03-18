import React from 'react';
import Svg, { ClipPath, Defs, G, Path } from 'react-native-svg';
import { SvgProps } from 'react-native-svg';

interface IconProps extends SvgProps {
  color?: string;
  size?: number;
}

export const HomeIcon: React.FC<IconProps> = ({ color = '#fff', size = 28, ...props }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 29 28" fill="none" {...props}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M14.184 1.413a1.167 1.167 0 011.432 0l10.5 8.166c.284.221.45.561.45.921v12.833a3.5 3.5 0 01-3.5 3.5H6.734a3.5 3.5 0 01-3.5-3.5V10.5c0-.36.166-.7.45-.92l10.5-8.168zM5.566 11.07v12.262A1.167 1.167 0 006.733 24.5h16.334a1.166 1.166 0 001.166-1.167V11.071L14.9 3.81l-9.334 7.26z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.233 14c0-.644.522-1.167 1.167-1.167h7c.644 0 1.167.523 1.167 1.167v11.667a1.167 1.167 0 01-2.334 0v-10.5h-4.667v10.5a1.167 1.167 0 01-2.333 0V14z"
        fill={color}
      />
    </Svg>
  );
};

export const SecondIcon: React.FC<IconProps> = ({ color = '#1A1A1A', size = 26, ...props }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 27 26" fill="none" {...props}>
      <G clipPath="url(#clip0_0_4230)">
        <Path
          d="M20.2 10.833h-1.365a8.667 8.667 0 10-8.385 10.834h9.75a5.417 5.417 0 000-10.834z"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </G>
      <Defs>
        <ClipPath id="clip0_0_4230">
          <Path fill="#fff" transform="translate(.7)" d="M0 0H26V26H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

export const ChatIcon: React.FC<IconProps> = ({ color = '#1A1A1A', size = 28, ...props }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 29 28" fill="none" {...props}>
      <Path
        d="M24.6 13.417a9.777 9.777 0 01-1.05 4.433 9.917 9.917 0 01-8.867 5.483 9.777 9.777 0 01-4.433-1.05L3.6 24.5l2.217-6.65a9.776 9.776 0 01-1.05-4.433A9.917 9.917 0 0110.25 4.55a9.776 9.776 0 014.433-1.05h.584a9.893 9.893 0 019.333 9.333v.584z"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const TaskIcon: React.FC<IconProps> = ({ color = '#1A1A1A', size = 26, ...props }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 26 26" fill="none" {...props}>
      <Path
        d="M9.75 11.917l3.25 3.25L23.833 4.333"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M22.75 13v7.583a2.167 2.167 0 01-2.167 2.167H5.416a2.167 2.167 0 01-2.166-2.167V5.417A2.167 2.167 0 015.416 3.25h11.917"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};


export const AddIcon = ({ color = '#1A1A1A', size = 26, ...props }) => {
  return (
    <Svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      <Path
        d="M21 10H3M21 6H3M21 14H3M21 18H3"
        stroke="#fff"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}