import { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import Button from '~shared/components/Button';
import { colors, shadows, spacing } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';

const DANGER_COLOR = '#B8383E';

const PaymentErrorScreen = memo(() => {
  const handleRetry = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleRestore = useCallback(() => {
    // TODO: trigger react-native-iap restore flow.
    NavigatorUtils.goBack();
  }, []);

  return (
    <View style={styles.root}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleRetry} />
      <View style={styles.modal}>
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: hexA(DANGER_COLOR, 0.12) },
          ]}
        >
          <Svg width={32} height={32} viewBox="0 0 32 32" fill="none">
            <Circle
              cx={16}
              cy={16}
              r={13}
              stroke={DANGER_COLOR}
              strokeWidth={2}
            />
            <Path
              d="M11 11l10 10M21 11L11 21"
              stroke={DANGER_COLOR}
              strokeWidth={2.2}
              strokeLinecap="round"
            />
          </Svg>
        </View>
        <Text style={styles.title}>{translate('paymentError.title')}</Text>
        <Text style={styles.body}>{translate('paymentError.body')}</Text>
        <View style={styles.actions}>
          <Button
            label={translate('paymentError.retry')}
            onPress={handleRetry}
          />
          <Pressable onPress={handleRestore} hitSlop={8}>
            <Text style={styles.restoreLabel}>
              {translate('paymentError.restore')}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  modal: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: spacing.xxl,
    alignItems: 'center',
    ...shadows.sheet,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg + 2,
  },
  title: {
    fontSize: 19,
    fontWeight: '600',
    letterSpacing: -0.3,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 21,
    textAlign: 'center',
  },
  actions: {
    width: '100%',
    marginTop: spacing.xl,
    gap: spacing.md,
    alignItems: 'center',
  },
  restoreLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});

export default PaymentErrorScreen;
