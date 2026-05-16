import { memo, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { hexA } from '~shared/utils/colorUtils';

type Props = {
  baseColor: string;
  count?: number;
};

type Piece = {
  left: string;
  top: string;
  size: number;
  rotation: number;
  color: string;
  circular: boolean;
};

const DEFAULT_COUNT = 28;

const Confetti = memo((props: Props) => {
  const count = props.count ?? DEFAULT_COUNT;

  const pieces = useMemo<Piece[]>(() => {
    const palette = [
      props.baseColor,
      hexA(props.baseColor, 0.55),
      '#FFFFFF',
      hexA(props.baseColor, 0.8),
    ];

    return Array.from({ length: count }).map((_, index) => {
      const seed = index * 137;
      return {
        left: `${(seed * 7) % 100}%`,
        top: `${((seed * 13) % 60) + 10}%`,
        size: 4 + (index % 4) * 2,
        rotation: index * 30,
        color: palette[index % palette.length],
        circular: index % 3 !== 0,
      };
    });
  }, [props.baseColor, count]);

  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      {pieces.map((piece, index) => (
        <View
          key={index}
          style={[
            styles.piece,
            {
              left: piece.left as `${number}%`,
              top: piece.top as `${number}%`,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: piece.circular ? piece.size : 1,
              transform: [{ rotate: `${piece.rotation}deg` }],
              opacity: 0.7,
            },
          ]}
        />
      ))}
    </View>
  );
});

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
  },
});

export default Confetti;
