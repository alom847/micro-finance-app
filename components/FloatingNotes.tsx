import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSession } from "@/context/SessionContext";
import { AddNote, DeleteNote, GetNotes } from "@/constants/api";
import { formateId } from "@/utils/formateId";
import Toast from "react-native-toast-message";
import { FontAwesome, Ionicons } from "@expo/vector-icons"; // Alternative to react-icons

interface Note {
  id: string;
  content: string;
  created_at: string;
  owner: {
    id: number;
    name: string;
  };
}

interface FloatingNotesBoxProps {
  noteType: "user" | "loans" | "deposits";
  noteTypeId: string;
}

const FloatingNotesBox: React.FC<FloatingNotesBoxProps> = ({
  noteType,
  noteTypeId,
}) => {
  const { user } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [notesLoading, setNotesLoading] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [show, setShow] = useState(false);

  const fetchNotes = useCallback(async () => {
    if (!noteTypeId || !noteType) return;

    setNotesLoading(true);
    try {
      const resp = await GetNotes(noteType, noteTypeId);
      if (resp.status) setNotes(resp.notes);
    } catch (e) {
      console.error("Failed to fetch notes");
    } finally {
      setNotesLoading(false);
    }
  }, [noteTypeId, noteType]);

  useEffect(() => {
    if (!show) return;
    fetchNotes();
  }, [show]);

  const handleAddNote = async () => {
    if (!noteInput.trim()) return;
    setNotesLoading(true);
    try {
      const resp = await AddNote(noteType, noteTypeId, noteInput);
      if (resp.status) {
        setNoteInput("");
        fetchNotes();
        Toast.show({ type: "success", text1: "Note added" });
      } else {
        Toast.show({ type: "error", text1: resp.message });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to add note" });
    } finally {
      setNotesLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    setNotesLoading(true);
    try {
      const resp = await DeleteNote("user", noteId);
      if (resp.status) {
        fetchNotes();
        Toast.show({ type: "success", text1: "Note deleted" });
      } else {
        Toast.show({ type: "error", text1: resp.message });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Failed to delete note" });
    } finally {
      setNotesLoading(false);
    }
  };

  return (
    <View>
      <Pressable onPress={() => setShow(true)}>
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: 8,
            gap: 4,
          }}
        >
          <View
            style={{
              backgroundColor: "orange",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 50,
              height: 50,
              borderRadius: 50,
            }}
          >
            <FontAwesome name="sticky-note" size={24} color="white" />
          </View>
          <Text style={{ textAlign: "center", fontSize: 12 }}>Notes</Text>
        </View>
      </Pressable>

      <Modal visible={show} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Notes</Text>
              <TouchableOpacity onPress={() => setShow(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notesList}>
              {notesLoading ? (
                <ActivityIndicator size="small" color="#666" />
              ) : notes.length === 0 ? (
                <Text style={styles.emptyText}>No notes found.</Text>
              ) : (
                notes.map((note) => (
                  <View key={note.id} style={styles.noteItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.noteMeta}>
                        <Text style={styles.noteOwner}>{note.owner.name}</Text>{" "}
                        ({formateId(note.owner.id)}){" "}
                        {new Date(note.created_at).toLocaleString()}
                      </Text>
                      <Text style={styles.noteContent}>{note.content}</Text>
                    </View>
                    {user?.role === "Admin" && (
                      <TouchableOpacity
                        onPress={() => handleDeleteNote(note.id)}
                        style={styles.deleteButton}
                      >
                        <Text style={styles.deleteText}>Delete</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))
              )}
            </ScrollView>

            <View style={styles.inputContainer}>
              <TextInput
                value={noteInput}
                onChangeText={setNoteInput}
                placeholder="Add a note..."
                style={styles.input}
                editable={!notesLoading}
                multiline
              />
              <TouchableOpacity
                onPress={handleAddNote}
                disabled={notesLoading || !noteInput.trim()}
                style={styles.addButton}
              >
                <Text style={styles.addButtonText}>
                  {notesLoading ? "Adding..." : "Add Note"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Toast />
      </Modal>
    </View>
  );
};

export default FloatingNotesBox;

const styles = StyleSheet.create({
  stickyButton: {
    position: "absolute",
    bottom: 24,
    right: 16,
    backgroundColor: "#4F46E5",
    padding: 12,
    borderRadius: 32,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 16,
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    fontSize: 20,
    color: "#888",
  },
  notesList: {
    maxHeight: 300,
  },
  emptyText: {
    textAlign: "center",
    color: "#666",
    marginTop: 16,
  },
  noteItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  noteMeta: {
    fontSize: 12,
    color: "#666",
  },
  noteOwner: {
    fontWeight: "bold",
  },
  noteContent: {
    fontSize: 14,
    color: "#333",
    marginTop: 4,
  },
  deleteButton: {
    paddingHorizontal: 8,
    justifyContent: "center",
  },
  deleteText: {
    color: "red",
    fontSize: 12,
  },
  inputContainer: {
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    minHeight: 60,
    textAlignVertical: "top",
  },
  addButton: {
    backgroundColor: "#4F46E5",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
