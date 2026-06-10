import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View, useColorScheme } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthRequired } from '@/components/auth-required';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { api, Note } from '@/services/api';

export default function NotesScreen() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'dark' ? 'dark' : 'light'];
  const { isAuthenticated, token } = useAuth();

  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const loadRequestIdRef = useRef(0);
  const isLoadingNotesRef = useRef(false);

  useEffect(() => {
    async function loadNotes() {
      if (!token || !isAuthenticated || isLoadingNotesRef.current) {
        return;
      }

      const requestId = ++loadRequestIdRef.current;
      isLoadingNotesRef.current = true;
      setIsLoading(true);
      setError(null);

      try {
        const response = await api.getNotes(token);
        if (requestId === loadRequestIdRef.current) {
          setNotes(response);
        }
      } catch (loadError) {
        if (requestId === loadRequestIdRef.current) {
          setError(loadError instanceof Error ? loadError.message : 'Failed to load notes');
        }
      } finally {
        if (requestId === loadRequestIdRef.current) {
          setIsLoading(false);
        }
        isLoadingNotesRef.current = false;
      }
    }

    void loadNotes();
  }, [token, isAuthenticated]);

  const authToken = token ?? '';

  async function handleSaveNote() {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      if (editingId) {
        const updated = await api.updateNote(authToken, editingId, {
          title: title.trim(),
          content: content.trim(),
        });
        setNotes((current) =>
          current.map((note) => (note._id === editingId ? updated : note))
        );
      } else {
        const created = await api.createNote(authToken, {
          title: title.trim(),
          content: content.trim(),
        });
        setNotes((current) => [created, ...current]);
      }

      setEditingId(null);
      setTitle('');
      setContent('');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Failed to save note');
    } finally {
      setIsSaving(false);
    }
  }

  const handleDeleteNote = useCallback(async (id: string) => {
    setError(null);

    try {
      await api.deleteNote(authToken, id);
      setNotes((current) => current.filter((note) => note._id !== id));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : 'Failed to delete note');
    }
  }, [authToken]);

  const handlePinToggle = useCallback(async (note: Note) => {
    setError(null);

    try {
      const updated = await api.updateNote(authToken, note._id, {
        isPinned: !note.isPinned,
      });
      setNotes((current) =>
        current
          .map((item) => (item._id === note._id ? updated : item))
          .sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
      );
    } catch (pinError) {
      setError(pinError instanceof Error ? pinError.message : 'Failed to update pin state');
    }
  }, [authToken]);

  const startEditing = useCallback((note: Note) => {
    setEditingId(note._id);
    setTitle(note.title);
    setContent(note.content);
    setError(null);
  }, []);

  function cancelEditing() {
    setEditingId(null);
    setTitle('');
    setContent('');
    setError(null);
  }

  const renderNote = useCallback(
    ({ item }: { item: Note }) => (
      <NoteRow
        note={item}
        onPinToggle={handlePinToggle}
        onEdit={startEditing}
        onDelete={handleDeleteNote}
      />
    ),
    [handleDeleteNote, handlePinToggle, startEditing]
  );

  if (!isAuthenticated || !token) {
    return <AuthRequired title="Notes" />;
  }

  return (
    <ThemedView style={styles.root}>
      <View style={[styles.screenHeader, { backgroundColor: '#6BAE8E' }]}>
        <View>
          <View style={styles.screenHeaderContent}>
            <Ionicons name="document-text" size={22} color="#fff" />
            <Text style={styles.screenHeaderTitle}>Notes</Text>
          </View>
          <Text style={styles.screenHeaderSub}>Appointment-ready notes — pin the important ones</Text>
        </View>
      </View>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <FlatList
          data={notes}
          keyExtractor={(item) => item._id}
          renderItem={renderNote}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <ThemedView type="backgroundElement" style={styles.card}>
            <ThemedText type="subtitle">Notes</ThemedText>
            <ThemedText themeColor="textSecondary">
              Keep appointment-ready notes and pin the ones you want first.
            </ThemedText>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Note title"
              placeholderTextColor={colors.textSecondary}
              style={[styles.input, { color: colors.text, borderColor: colors.backgroundSelected }]}
            />

            <TextInput
              value={content}
              onChangeText={setContent}
              multiline
              placeholder="Write your note"
              placeholderTextColor={colors.textSecondary}
              style={[
                styles.input,
                styles.contentInput,
                { color: colors.text, borderColor: colors.backgroundSelected },
              ]}
            />

            <Pressable onPress={handleSaveNote} disabled={isSaving}>
              <ThemedView type="backgroundSelected" style={styles.button}>
                {isSaving ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <ThemedText type="smallBold">{editingId ? 'Save Note' : 'Add Note'}</ThemedText>
                )}
              </ThemedView>
            </Pressable>

            {editingId ? (
              <Pressable onPress={cancelEditing}>
                <ThemedView type="background" style={styles.button}>
                  <ThemedText type="smallBold">Cancel Edit</ThemedText>
                </ThemedView>
              </Pressable>
            ) : null}

            {isLoading ? (
              <View style={styles.loadingRow}>
                <ActivityIndicator />
                <ThemedText>Loading notes...</ThemedText>
              </View>
            ) : null}

            {error ? <ThemedText themeColor="textSecondary">{error}</ThemedText> : null}
            </ThemedView>
          }
          ListEmptyComponent={
            !isLoading ? (
              <ThemedView type="background" style={styles.emptyCard}>
                <ThemedText themeColor="textSecondary">No notes yet. Add your first one above.</ThemedText>
              </ThemedView>
            ) : null
          }
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const NoteRow = React.memo(function NoteRow({
  note,
  onPinToggle,
  onEdit,
  onDelete,
}: {
  note: Note;
  onPinToggle: (note: Note) => Promise<void>;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <ThemedView type="background" style={styles.noteCard}>
      <ThemedText type="smallBold">
        {note.isPinned ? 'Pinned | ' : ''}
        {note.title}
      </ThemedText>
      <ThemedText>{note.content}</ThemedText>
      <View style={styles.noteActions}>
        <Pressable onPress={() => void onPinToggle(note)}>
          <ThemedView style={styles.deleteButton}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              {note.isPinned ? 'Unpin' : 'Pin'}
            </ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => onEdit(note)}>
          <ThemedView style={styles.deleteButton}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Edit
            </ThemedText>
          </ThemedView>
        </Pressable>
        <Pressable onPress={() => void onDelete(note._id)}>
          <ThemedView style={styles.deleteButton}>
            <ThemedText type="smallBold" themeColor="textSecondary">
              Delete
            </ThemedText>
          </ThemedView>
        </Pressable>
      </View>
    </ThemedView>
  );
});

const styles = StyleSheet.create({
  root: { flex: 1 },
  screenHeader: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  screenHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    paddingTop: Spacing.two,
  },
  screenHeaderTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  screenHeaderSub: { color: 'rgba(255,255,255,0.82)', fontSize: 12, marginTop: 4, paddingBottom: 2 },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  listContent: {
    paddingTop: Spacing.three,
    paddingBottom: Spacing.four,
    gap: Spacing.three,
  },
  card: {
    borderRadius: Spacing.four,
    padding: Spacing.four,
    gap: Spacing.three,
  },
  input: {
    borderWidth: 1,
    borderRadius: Spacing.three,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    fontSize: 16,
  },
  contentInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    borderRadius: Spacing.three,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  noteCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  emptyCard: {
    borderRadius: Spacing.three,
    padding: Spacing.three,
  },
  noteActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.three,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
});

