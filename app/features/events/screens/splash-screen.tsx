import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BientotLogo from '~shared/assets/icons/bientot-logo.svg';
import ScreenContainer from '~shared/components/ScreenContainer';
import { colors, spacing } from '~shared/theme';

const SplashScreen = memo(() => {
  return (
    <ScreenContainer>
      <View style={styles.root}>
        <BientotLogo width={96} height={96} />
        <Text style={styles.wordmark}>Bientôt</Text>
      </View>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  wordmark: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.6,
    color: colors.textPrimary,
  },
});

export default SplashScreen;
