import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { tokens } from '../lib/designTokens';

interface LibraryFilterBarProps {
  search: string;
  setSearch: (text: string) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  filterLang: string | null;
  setFilterLang: (lang: string | null) => void;
}

export function LibraryFilterBar({
  search,
  setSearch,
  filterStatus,
  setFilterStatus,
  filterLang,
  setFilterLang,
}: LibraryFilterBarProps) {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder="Search title or author"
        placeholderTextColor={tokens.colors.textSecondary}
        style={styles.searchInput}
        value={search}
        onChangeText={setSearch}
      />
      <View style={styles.filterRow}>
        {['to-read', 'in-progress', 'finished'].map((status) => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterPill,
              {
                backgroundColor:
                  filterStatus === status ? tokens.colors.primary : tokens.colors.surface,
              },
            ]}
            onPress={() => setFilterStatus(filterStatus === status ? null : status)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterStatus === status ? tokens.colors.textPrimary : tokens.colors.textSecondary },
              ]}
            >
              {status.replace('-', ' ')}
            </Text>
          </TouchableOpacity>
        ))}
        {['ar', 'fr', 'tz'].map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[
              styles.filterPill,
              {
                backgroundColor:
                  filterLang === lang ? tokens.colors.primary : tokens.colors.surface,
              },
            ]}
            onPress={() => setFilterLang(filterLang === lang ? null : lang)}
          >
            <Text
              style={[
                styles.filterText,
                { color: filterLang === lang ? tokens.colors.textPrimary : tokens.colors.textSecondary },
              ]}
            >
              {lang.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: tokens.spacing.m,
  },
  searchInput: {
    height: 40,
    borderRadius: tokens.radius,
    backgroundColor: tokens.colors.surface,
    paddingHorizontal: tokens.spacing.s,
    color: tokens.colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: tokens.spacing.s,
  },
  filterPill: {
    paddingHorizontal: tokens.spacing.s,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: tokens.spacing.s,
    marginBottom: tokens.spacing.s,
  },
  filterText: {
    fontSize: 12,
  },
});
