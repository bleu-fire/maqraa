import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors } from '../constants/Colors';

export type Language = 'ar' | 'fr' | 'tz' | 'en';
export type Status = 'to-read' | 'in-progress' | 'finished';

type Props = {
  title: string;
  author: string;
  language: Language;
  status: Status;
  coverUri?: string;
  progressPercent?: number; // 0 to 100
  onPress?: () => void;
};

export const BookCard: React.FC<Props> = ({
  title,
  author,
  language,
  status,
  coverUri,
  progressPercent = 0,
  onPress,
}) => {
  const isArabic = language === 'ar';

  const getLanguageColor = (lang: Language) => {
    switch (lang) {
      case 'ar': return Colors.terracotta;
      case 'fr': return Colors.majorelle;
      case 'tz': return Colors.mint;
      default: return Colors.textSecondary;
    }
  };

  const getStatusText = (stat: Status) => {
    switch (stat) {
      case 'to-read': return 'To-Read';
      case 'in-progress': return 'In-Progress';
      case 'finished': return 'Finished';
    }
  };

  const statusColors = {
    'to-read': { bg: 'rgba(212, 168, 67, 0.15)', text: Colors.gold },
    'in-progress': { bg: 'rgba(96, 80, 220, 0.15)', text: Colors.majorelle },
    'finished': { bg: 'rgba(62, 180, 137, 0.15)', text: Colors.success },
  };

  return (
    <TouchableOpacity
      style={[styles.container, isArabic && styles.containerRTL]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.coverContainer}>
        {coverUri ? (
          <Image source={{ uri: coverUri }} style={styles.cover} />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>

      <View style={[styles.content, isArabic && styles.contentRTL]}>
        <View>
          <View style={[styles.headerRow, isArabic && styles.headerRowRTL]}>
            <Text
              style={[styles.title, isArabic && styles.textRTL]}
              numberOfLines={2}
            >
              {title}
            </Text>
            <View style={[styles.langBadge, { backgroundColor: getLanguageColor(language) }]}>
              <Text style={styles.langText}>{language.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={[styles.author, isArabic && styles.textRTL]}>{author}</Text>
        </View>

        <View style={styles.footerRow}>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[status].bg }]}>
            <Text style={[styles.statusText, { color: statusColors[status].text }]}>
              {getStatusText(status)}
            </Text>
          </View>
          {status === 'in-progress' && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressPercentText}>{progressPercent}%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.bgSurface,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.bgElevated,
    marginHorizontal: 16,
    height: 140,
  },
  containerRTL: {
    flexDirection: 'row-reverse',
  },
  coverContainer: {
    width: 96,
    height: '100%',
    backgroundColor: Colors.bgElevated,
  },
  cover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.bgElevated,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  contentRTL: {
    alignItems: 'flex-end',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  headerRowRTL: {
    flexDirection: 'row-reverse',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  textRTL: {
    textAlign: 'right',
  },
  langBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  langText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 4,
  },
  progressPercentText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  progressBarBg: {
    width: '100%',
    height: 4,
    backgroundColor: Colors.bgElevated,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.mint,
    borderRadius: 2,
  },
});
