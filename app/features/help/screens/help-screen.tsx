import { memo, useCallback, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavigatorUtils from '~/navigators/NavigatorUtils';
import CircleButton from '~shared/components/CircleButton';
import ScreenContainer from '~shared/components/ScreenContainer';
import UiIcon from '~shared/components/UiIcon';
import { colors, radius, shadows, spacing, typography } from '~shared/theme';
import { hexA } from '~shared/utils/colorUtils';
import { translate } from '~i18n/translate';

type FaqItem = {
  key: string;
  questionKey: string;
  answerKey?: string;
};

const FAQ_ITEMS: FaqItem[] = [
  { key: 'faq1', questionKey: 'help.faq1Q', answerKey: 'help.faq1A' },
  { key: 'faq2', questionKey: 'help.faq2Q' },
  { key: 'faq3', questionKey: 'help.faq3Q' },
  { key: 'faq4', questionKey: 'help.faq4Q' },
  { key: 'faq5', questionKey: 'help.faq5Q' },
  { key: 'faq6', questionKey: 'help.faq6Q' },
];

type FaqRowProps = {
  question: string;
  answer?: string;
  isOpen: boolean;
  isLast: boolean;
  onToggle: () => void;
};

const FaqRow = memo((props: FaqRowProps) => {
  return (
    <Pressable
      onPress={props.onToggle}
      style={({ pressed }) => [
        styles.faqRow,
        !props.isLast && styles.faqRowDivider,
        pressed && styles.faqRowPressed,
      ]}
    >
      <View style={styles.faqRowHeader}>
        <Text style={styles.faqQuestion}>{props.question}</Text>
        <View
          style={[styles.faqChevron, props.isOpen && styles.faqChevronOpen]}
        >
          <UiIcon name="chevron" size={13} color={colors.textMuted} />
        </View>
      </View>
      {props.isOpen && props.answer != null && (
        <Text style={styles.faqAnswer}>{props.answer}</Text>
      )}
    </Pressable>
  );
});

type ContactCardProps = {
  emoji: string;
  title: string;
  body: string;
  onPress: () => void;
};

const ContactCard = memo((props: ContactCardProps) => {
  return (
    <Pressable
      onPress={props.onPress}
      style={({ pressed }) => [
        styles.contactCard,
        pressed && styles.contactCardPressed,
      ]}
    >
      <Text style={styles.contactEmoji}>{props.emoji}</Text>
      <View style={styles.contactText}>
        <Text style={styles.contactTitle}>{props.title}</Text>
        <Text style={styles.contactBody}>{props.body}</Text>
      </View>
      <UiIcon name="chevronRight" size={12} color={colors.textMuted} />
    </Pressable>
  );
});

type RoadmapItem = {
  label: string;
  status: string;
  color: string;
};

const ROADMAP_COLORS = {
  inProgress: '#5E3F8F',
  planned: '#1E4D80',
  considering: '#5C544A',
};

type RoadmapRowProps = {
  item: RoadmapItem;
  isLast: boolean;
};

const RoadmapRow = memo((props: RoadmapRowProps) => {
  return (
    <View style={[styles.roadmapRow, !props.isLast && styles.roadmapDivider]}>
      <Text style={styles.roadmapLabel}>{props.item.label}</Text>
      <View
        style={[
          styles.roadmapStatusChip,
          { backgroundColor: hexA(props.item.color, 0.1) },
        ]}
      >
        <Text style={[styles.roadmapStatusLabel, { color: props.item.color }]}>
          {props.item.status}
        </Text>
      </View>
    </View>
  );
});

const HelpScreen = memo(() => {
  const [openFaq, setOpenFaq] = useState<string | null>('faq1');

  const handlePressBack = useCallback(() => {
    NavigatorUtils.goBack();
  }, []);

  const handleToggleFaq = useCallback((key: string) => {
    setOpenFaq(current => (current === key ? null : key));
  }, []);

  const handleContactPress = useCallback(() => {
    // TODO: open mailto: with prefilled subject + device metadata.
  }, []);

  const roadmap: RoadmapItem[] = [
    {
      label: translate('help.roadmapDarkMode'),
      status: translate('help.roadmapDarkModeStatus'),
      color: ROADMAP_COLORS.inProgress,
    },
    {
      label: translate('help.roadmapLiveActivities'),
      status: translate('help.roadmapLiveActivitiesStatus'),
      color: ROADMAP_COLORS.planned,
    },
    {
      label: translate('help.roadmapIcloud'),
      status: translate('help.roadmapIcloudStatus'),
      color: ROADMAP_COLORS.considering,
    },
  ];

  return (
    <ScreenContainer>
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.headerRow}>
          <CircleButton
            icon={<UiIcon name="back" size={18} color={colors.textPrimary} />}
            onPress={handlePressBack}
          />
          <Text style={styles.headerTitle}>{translate('help.title')}</Text>
        </View>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionLabel}>
            {translate('help.sectionFaq')}
          </Text>
          <View style={styles.faqCard}>
            {FAQ_ITEMS.map((item, index) => {
              const handleToggle = () => handleToggleFaq(item.key);
              return (
                <FaqRow
                  key={item.key}
                  question={translate(item.questionKey)}
                  answer={
                    item.answerKey != null
                      ? translate(item.answerKey)
                      : undefined
                  }
                  isOpen={openFaq === item.key}
                  isLast={index === FAQ_ITEMS.length - 1}
                  onToggle={handleToggle}
                />
              );
            })}
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
            {translate('help.sectionContact')}
          </Text>
          <View style={styles.contactList}>
            <ContactCard
              emoji="📧"
              title={translate('help.contactHelpTitle')}
              body={translate('help.contactHelpBody')}
              onPress={handleContactPress}
            />
            <ContactCard
              emoji="💡"
              title={translate('help.contactFeatureTitle')}
              body={translate('help.contactFeatureBody')}
              onPress={handleContactPress}
            />
            <ContactCard
              emoji="🐞"
              title={translate('help.contactBugTitle')}
              body={translate('help.contactBugBody')}
              onPress={handleContactPress}
            />
          </View>

          <Text style={[styles.sectionLabel, styles.sectionLabelSpaced]}>
            {translate('help.sectionRoadmap')}
          </Text>
          <View style={styles.roadmapCard}>
            {roadmap.map((item, index) => (
              <RoadmapRow
                key={item.label}
                item={item}
                isLast={index === roadmap.length - 1}
              />
            ))}
          </View>

          <Text style={styles.footer}>{translate('help.footer')}</Text>
        </ScrollView>
      </SafeAreaView>
    </ScreenContainer>
  );
});

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    color: colors.textPrimary,
  },
  scroll: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.huge,
  },
  sectionLabel: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    marginBottom: spacing.md - 2,
  },
  sectionLabelSpaced: {
    marginTop: spacing.xxl,
  },
  faqCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    overflow: 'hidden',
    ...shadows.card,
  },
  faqRow: {
    paddingVertical: 14,
    paddingHorizontal: spacing.lg,
  },
  faqRowDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  faqRowPressed: {
    backgroundColor: colors.surfaceSoft,
  },
  faqRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  faqQuestion: {
    flex: 1,
    fontSize: 14.5,
    fontWeight: '500',
    lineHeight: 19,
    color: colors.textPrimary,
  },
  faqChevron: {
    transform: [{ rotate: '0deg' }],
  },
  faqChevronOpen: {
    transform: [{ rotate: '180deg' }],
  },
  faqAnswer: {
    fontSize: 13.5,
    color: colors.textSecondary,
    marginTop: spacing.md - 2,
    lineHeight: 20,
  },
  contactList: {
    gap: 10,
  },
  contactCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    ...shadows.card,
  },
  contactCardPressed: {
    opacity: 0.85,
  },
  contactEmoji: {
    fontSize: 22,
    lineHeight: 26,
  },
  contactText: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  contactBody: {
    fontSize: 12.5,
    color: colors.textSecondary,
    marginTop: 2,
  },
  roadmapCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    ...shadows.card,
  },
  roadmapRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  roadmapDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.borderSoft,
  },
  roadmapLabel: {
    flex: 1,
    fontSize: 14.5,
    color: colors.textPrimary,
  },
  roadmapStatusChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  roadmapStatusLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  footer: {
    fontSize: 12.5,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: spacing.xxl,
  },
});

export default HelpScreen;
