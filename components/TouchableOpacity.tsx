import React from 'react';
import { 
  TouchableOpacity as RNTouchableOpacity, 
  TouchableOpacityProps 
} from 'react-native';

export const TouchableOpacity: React.FC<TouchableOpacityProps> = ({ 
  children, 
  style, 
  activeOpacity = 0.7,
  ...props 
}) => {
  return (
    <RNTouchableOpacity
      style={style}
      activeOpacity={activeOpacity}
      {...props}
    >
      {children}
    </RNTouchableOpacity>
  );
};

