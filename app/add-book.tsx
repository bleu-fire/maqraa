import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { tokens } from '../lib/designTokens';
import { useBookStore } from '../store/useBookStore';

export default function AddBookScreen() {
  const router = useRouter();
  const addBook = useBookStore((state) => state.addBook);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [totalPages, setTotalPages] = useState('');
  const [coverUri, setCoverUri] = useState<string | null>(null);

  const handlePickCover = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [2, 3], // 2:3 ratio is perfect for book covers
      quality: 0.6,
    });

    if (!result.canceled && result.assets[0]) {
      setCoverUri(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!title || !author || !totalPages) return; // Simple validation

    addBook({
      id: Math.random().toString(36).substring(7), // Simple random ID
      title,
      author,
      totalPages: parseInt(totalPages, 10),
      currentPage: 0,
      coverUri,
      status: 'to-read',
    });
    
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <AntDesign name="arrow-left" size={24} color={tokens.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Book</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter book title"
          placeholderTextColor={tokens.colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Author</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter author name"
          placeholderTextColor={tokens.colors.textSecondary}
          value={author}
          onChangeText={setAuthor}
        />

        <Text style={styles.label}>Total Pages</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g. 350"
          placeholderTextColor={tokens.colors.textSecondary}
          keyboardType="numeric"
          value={totalPages}
          onChangeText={setTotalPages}
        />

        <Text style={styles.label}>Cover Image</Text>
        {coverUri ? (
          <TouchableOpacity style={styles.coverPreviewContainer} onPress={handlePickCover}>
            <Image source={{ uri: coverUri }} style={styles.coverPreview} />
            <View style={styles.changeCoverOverlay}>
              <AntDesign name="edit" size={24} color={tokens.colors.textPrimary} />
              <Text style={styles.changeCoverText}>Change</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.cameraPlaceholder} onPress={handlePickCover}>
            <AntDesign name="camera" size={32} color={tokens.colors.textSecondary} />
            <Text style={styles.cameraText}>Add Cover Photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>Save Book</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.bgBase,
    padding: tokens.spacing.m,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
  },
  backButton: {
    marginRight: tokens.spacing.m,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: tokens.colors.textPrimary,
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.s,
    fontWeight: '500',
  },
  input: {
    backgroundColor: tokens.colors.surface,
    color: tokens.colors.textPrimary,
    padding: tokens.spacing.m,
    borderRadius: tokens.radius,
    marginBottom: tokens.spacing.l,
    borderWidth: 1,
    borderColor: tokens.colors.elevated,
  },
  cameraPlaceholder: {
    height: 160,
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radius,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: tokens.spacing.xl,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: tokens.colors.textSecondary,
  },
  cameraText: {
    color: tokens.colors.textSecondary,
    marginTop: tokens.spacing.s,
    fontSize: 14,
  },
  coverPreviewContainer: {
    height: 160,
    width: 106, // 2:3 aspect ratio
    alignSelf: 'center',
    marginBottom: tokens.spacing.xl,
    borderRadius: tokens.radius,
    overflow: 'hidden',
  },
  coverPreview: {
    width: '100%',
    height: '100%',
  },
  changeCoverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeCoverText: {
    color: tokens.colors.textPrimary,
    marginTop: 4,
    fontSize: 12,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: tokens.colors.primary,
    padding: tokens.spacing.m,
    borderRadius: tokens.radius,
    alignItems: 'center',
    marginTop: 'auto', // Pushes button to bottom
    marginBottom: tokens.spacing.l,
  },
  saveButtonText: {
    color: tokens.colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
