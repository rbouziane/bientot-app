import { memo } from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type UiIconName =
  | 'plus'
  | 'filter'
  | 'chevron'
  | 'chevronRight'
  | 'close'
  | 'check'
  | 'lock'
  | 'search'
  | 'share'
  | 'edit'
  | 'trash'
  | 'back'
  | 'more';

type Props = {
  name: UiIconName;
  size: number;
  color: string;
};

const UiIcon = memo((props: Props) => {
  const { name, size, color } = props;

  if (name === 'plus') {
    return (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M9 3v12M3 9h12"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (name === 'filter') {
    return (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M3 5h12M5 9h8M7 13h4"
          stroke={color}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (name === 'chevron') {
    return (
      <Svg width={size} height={size * 0.6} viewBox="0 0 12 7" fill="none">
        <Path
          d="M1 1l5 5 5-5"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'chevronRight') {
    return (
      <Svg width={size * 0.6} height={size} viewBox="0 0 7 12" fill="none">
        <Path
          d="M1 1l5 5-5 5"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'close') {
    return (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M4 4l10 10M14 4L4 14"
          stroke={color}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (name === 'check') {
    return (
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Path
          d="M3 8.5l3.5 3.5L13 5"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'lock') {
    return (
      <Svg width={size} height={size} viewBox="0 0 14 14" fill="none">
        <Path d="M3 6h8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" fill={color} />
        <Path
          d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6"
          stroke={color}
          strokeWidth={1.4}
          fill="none"
        />
      </Svg>
    );
  }

  if (name === 'search') {
    return (
      <Svg width={size} height={size} viewBox="0 0 16 16" fill="none">
        <Circle cx="7" cy="7" r="4.5" stroke={color} strokeWidth={1.6} />
        <Path
          d="M10.5 10.5l3 3"
          stroke={color}
          strokeWidth={1.7}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (name === 'share') {
    return (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M9 1.5v10M5 5l4-3.5L13 5"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M3 9v6a1.5 1.5 0 0 0 1.5 1.5h9A1.5 1.5 0 0 0 15 15V9"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      </Svg>
    );
  }

  if (name === 'edit') {
    return (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M3 13.5L3 15h1.5L13 6.5 11.5 5 3 13.5Z M12.5 4l1.5 1.5"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'trash') {
    return (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M4 5h10M7 5V3.5h4V5M5.5 5l.5 9.5h6L12.5 5"
          stroke={color}
          strokeWidth={1.6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'back') {
    return (
      <Svg width={size} height={size} viewBox="0 0 18 18" fill="none">
        <Path
          d="M11 3L5 9l6 6"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  }

  if (name === 'more') {
    return (
      <Svg width={size} height={size / 4} viewBox="0 0 22 6">
        <Circle cx="3" cy="3" r="2.2" fill={color} />
        <Circle cx="11" cy="3" r="2.2" fill={color} />
        <Circle cx="19" cy="3" r="2.2" fill={color} />
      </Svg>
    );
  }

  return null;
});

export default UiIcon;
