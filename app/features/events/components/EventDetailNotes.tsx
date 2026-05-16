import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '~shared/theme';
import { translate } from '~i18n/translate';

type Props = {
  notes: string;
};

const EventDetailNotes = memo((props: Props) => {
  return (
    <View style={styles.root}>
      <Text style={styles.label}>
        {translate('detail.notes').toUpperCase()}
      </Text>
      <Text style={styles.content}>{props.notes}</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    marginHorizontal: spacing.xxl,
    marginTop: spacing.xxxl,
    padding: spacing.lg,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceTranslucent,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    marginBottom: spacing.xs + 2,
  },
  content: {
    ...typography.body,
    color: colors.textPrimary,
  },
});

export default EventDetailNotes;
