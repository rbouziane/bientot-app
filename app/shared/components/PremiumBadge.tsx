import { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PALETTE } from '~shared/constants/Palette';
import { COLOR_KEY } from '~shared/constants/ColorKey';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';

const PremiumBadge = memo(() => {
  const accent = PALETTE[COLOR_KEY.ORANGE].dark;

  return (
    <View style={[styles.badge, { backgroundColor: hexA(accent, 0.12) }]}>
      <Text style={[styles.label, { color: accent }]}>
        {translate('common.premium').toUpperCase()}
      </Text>
    </View>
  );
});

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});

export default PremiumBadge;
