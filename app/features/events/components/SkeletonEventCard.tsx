import { memo } from 'react';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { colors, radius } from '~shared/theme';

const SkeletonEventCard = memo(() => {
  return (
    <SkeletonPlaceholder
      backgroundColor={colors.surfaceSoft}
      highlightColor={colors.surfacePressed}
      borderRadius={radius.xxl}
      speed={1400}
    >
      <SkeletonPlaceholder.Item height={102} borderRadius={radius.xxl} />
    </SkeletonPlaceholder>
  );
});

export default SkeletonEventCard;
