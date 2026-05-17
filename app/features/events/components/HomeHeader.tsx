import { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { format } from 'date-fns';
import BientotLogo from '~shared/assets/icons/bientot-logo.svg';
import { colors, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';
import AddEventButton from './AddEventButton';

type Props = {
  onLongPressTitle?: () => void;
  onPressAdd: () => void;
};

const HomeHeader = memo((props: Props) => {
  const eyebrowDate = useMemo(() => format(new Date(), 'EEEE d MMMM'), []);

  const handleLongPress = useCallback(() => {
    if (props.onLongPressTitle == null) {
      return;
    }
    props.onLongPressTitle();
  }, [props.onLongPressTitle]);

  return (
    <View style={styles.root}>
      <View style={styles.left}>
        <BientotLogo width={42} height={42} />
        <Pressable
          onLongPress={handleLongPress}
          delayLongPress={600}
          style={styles.textBlock}
        >
          <Text style={styles.eyebrow}>{eyebrowDate}</Text>
          <Text style={styles.wordmark}>{translate('events.title')}</Text>
        </Pressable>
      </View>
      <AddEventButton onPress={props.onPressAdd} />
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: spacing.lg,
  },
  left: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
  },
  eyebrow: {
    fontSize: 11.5,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    fontWeight: '600',
    marginBottom: 3,
  },
  wordmark: {
    ...typography.appTitle,
    fontSize: 28,
    letterSpacing: -0.8,
    lineHeight: 28,
    color: colors.textPrimary,
  },
});

export default HomeHeader;
