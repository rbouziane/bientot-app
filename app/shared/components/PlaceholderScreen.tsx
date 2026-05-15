// TODO: composant d'échafaudage temporaire — à supprimer une fois tous les
// écrans implémentés (étapes 6 à 9). Aucun écran final ne doit l'utiliser.

import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors, spacing, typography } from '~shared/theme';
import ScreenContainer from './ScreenContainer';

type Props = {
  title: string;
  subtitle?: string;
};

const PlaceholderScreen = memo((props: Props) => {
  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Text style={styles.title}>{props.title}</Text>
          {props.subtitle != null && (
            <Text style={styles.subtitle}>{props.subtitle}</Text>
          )}
        </View>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xxl,
  },
  title: {
    ...typography.h1,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
});

export default PlaceholderScreen;
