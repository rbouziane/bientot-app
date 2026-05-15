import { colors } from './colors';
import { spacing, radius } from './spacing';
import { typography } from './typography';
import { style, shadows, tabular } from './style';

export const theme = { colors, spacing, radius, typography, style } as const;

export { colors, spacing, radius, typography, style, shadows, tabular };
