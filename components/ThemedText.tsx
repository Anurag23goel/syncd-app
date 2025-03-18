import { Text, type TextProps, StyleSheet } from 'react-native';
import { moderateScale } from '@/utils/spacing';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color },
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontFamily: 'SFPro-Regular',
  },
  defaultSemiBold: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    fontWeight: '600',
    fontFamily: 'SFPro-Semibold',
  },
  title: {
    fontSize: moderateScale(28),
    lineHeight: moderateScale(34),
    fontWeight: 'bold',
    fontFamily: 'SFPro-Bold',
  },
  subtitle: {
    fontSize: moderateScale(20),
    lineHeight: moderateScale(26),
    fontWeight: '600',
    fontFamily: 'SFPro-Bold',
  },
  link: {
    fontSize: moderateScale(16),
    lineHeight: moderateScale(24),
    color: '#0a7ea4',
    textDecorationLine: 'underline',
    fontFamily: 'SFPro-Regular',
  },
});
