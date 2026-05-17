import { memo, ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, shadows, spacing } from '~shared/theme';

type Props = {
  label: string;
  rightAction?: ReactNode;
  children: ReactNode;
};

const FieldGroup = memo((props: Props) => {
  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.label}>{props.label}</Text>
        {props.rightAction}
      </View>
      <View style={styles.card}>{props.children}</View>
    </View>
  );
});

const styles = StyleSheet.create({
  root: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.sm,
  },
  label: {
    fontSize: 11.5,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    ...shadows.card,
  },
});

export default FieldGroup;
