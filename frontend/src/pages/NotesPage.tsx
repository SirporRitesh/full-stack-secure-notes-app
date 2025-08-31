/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Trash2, Pencil } from "lucide-react";
import logo from "/images/logo.jpg";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// --- Types ---
type User = { name: string; email: string };
type Note = { _id: string; title: string; content?: string; createdAt: string };

// --- Helper: Mask email except first 2 chars of local-part ---
function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const masked =
    local.length <= 2
      ? local
      : local.slice(0, 2) + "*".repeat(local.length - 2);
  return `${masked}@${domain}`;
}

// Helper to extract name from email
function getNameFromEmail(email: string): string {
  return email.split("@")[0];
}

const NotesPage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchUserAndNotes() {
      try {
        const userRes = await api.get("/auth/me");
        if (!userRes.data?.user?.userId) {
          throw new Error("Invalid user response");
        }
        if (!isMounted) return;
        setUser(userRes.data.user);

        const notesRes = await api.get("/notes");
        if (!Array.isArray(notesRes.data?.notes)) {
          throw new Error("Invalid notes response");
        }
        setNotes(notesRes.data.notes);
      } catch (err: any) {
        if (err?.response?.status === 401) {
          navigate("/auth/sign-in");
        } else {
          toast({
            title: "Error loading dashboard",
            description: err.message || "Network error",
            variant: "destructive",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchUserAndNotes();
    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // --- Create Note ---
  async function handleCreateNote() {
    setCreating(true);
    try {
      const res = await fetch("http://localhost:4000/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // If you use JWT in Authorization header, add it here
          // Authorization: `Bearer ${token}`,
        },
        credentials: "include", // Important if using cookies for auth
        body: JSON.stringify({ title: "Untitled Note", content: "" }),
      });
      if (res.ok) {
        const data = await res.json();
        const newNote = data.note;
        navigate(`/notes/${newNote._id}`); // Go to editor page
      } else {
        // Handle error
      }
    } catch (err: any) {
      toast({
        title: "Failed to create note",
        description: err.message || "Network error",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  }

  // --- Delete Note ---
  async function handleDeleteNote(id: string) {
    if (!window.confirm("Delete this note?")) return;
    const prevNotes = [...notes];
    setNotes((notes) => notes.filter((n) => n._id !== id));
    try {
      const res = await api.delete(`/notes/${id}`);
      if (!res.data?.ok) throw new Error("Delete failed");
      toast({ title: "Note deleted", variant: "default" });
    } catch (err: any) {
      setNotes(prevNotes); // rollback
      toast({
        title: "Failed to delete note",
        description: err.message || "Network error",
        variant: "destructive",
      });
    }
  }

  // Confirm delete handler for AlertDialog
  async function confirmDelete() {
    if (!noteToDelete) return;

    const prevNotes = [...notes];
    setNotes((notes) => notes.filter((n) => n._id !== noteToDelete)); // Optimistic UI update

    try {
      await api.delete(`/notes/${noteToDelete}`);
      toast({ title: "Note deleted" });
    } catch (err: any) {
      setNotes(prevNotes); // Rollback on error
      toast({
        title: "Failed to delete note",
        description: err.message || "Network error",
        variant: "destructive",
      });
    } finally {
      setNoteToDelete(null); // Close the dialog
    }
  }

  // --- Sign Out ---
  async function handleSignOut() {
    setSigningOut(true);
    try {
      await api.post("/auth/logout");
      navigate("/auth/sign-in");
    } catch (err: any) {
      toast({
        title: "Failed to sign out",
        description: err.message || "Network error",
        variant: "destructive",
      });
    } finally {
      setSigningOut(false);
    }
  }

  // --- Placeholder for future edit functionality ---
  function handleEditNote(_id: string) {
    // Reserved for future use
  }

  // --- Loading indicator ---
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <span className="text-gray-500">Loading dashboard...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* --- Top bar --- */}
      <div className="flex items-center justify-between px-4 py-4 border-b">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8 w-8 rounded" />
          <span className="font-bold text-lg">Dashboard</span>
        </div>
        <Button
          variant="ghost"
          className="text-blue-600 font-medium underline decoration-blue-600 
                   hover:text-blue-600 focus:text-blue-600 active:text-blue-600 
                   visited:text-blue-600"
          onClick={handleSignOut}
          disabled={signingOut}
          aria-label="Sign Out"
        >
          {signingOut ? "Signing Out..." : "Sign Out"}
        </Button>
      </div>

      {/* --- Main Content Container --- */}
      <div className="flex flex-col items-center mt-4">
        {/* --- Welcome Card (Left-aligned content, reduced padding) --- */}
        <Card className="w-full max-w-md mx-auto p-4 shadow-md rounded-lg">
          <div className="text-left">
            <div className="font-bold text-xl mb-2">
              Welcome, {user?.name || (user?.email ? getNameFromEmail(user.email) : "User")}!
            </div>
            {user?.email && (
              <div className="text-gray-500 mt-4">
                Email: {maskEmail(user.email)}
              </div>
            )}
          </div>
        </Card>

        {/* --- Create Note Button (Reduced top margin) --- */}
        <Button
          className="mt-4 w-full max-w-md h-12 text-base font-semibold bg-hd-blue hover:bg-hd-blue-dark text-white"
          onClick={handleCreateNote}
          disabled={creating}
          aria-label="Create Note"
        >
          {creating ? "Creating..." : "Create Note"}
        </Button>
      </div>

      {/* --- Notes List (Reduced top margin, tighter spacing) --- */}
      <div className="max-w-md mx-auto mt-6 w-full px-4">
        <Label className="text-lg font-semibold mb-3 block">Notes</Label>
        {notes.length === 0 ? (
          <div className="text-gray-400 text-center py-8">
            Looks empty here. Let's get started with your first note!
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note) => (
              <Card
                key={note._id}
                className="flex items-center justify-between p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Link to={`/notes/${note._id}`} className="flex-grow">
                  <div>
                    <div className="font-medium">{note.title}</div>
                    {note.createdAt && (
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(note.createdAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                </Link>
                <div className="flex items-center gap-2 ml-4">
                  <Link to={`/notes/${note._id}`}>
                    <Pencil size={20} className="text-gray-400 hover:text-blue-600" aria-label="Edit note" />
                  </Link>
                  {/* --- AlertDialog for Delete --- */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        onClick={() => setNoteToDelete(note._id)}
                        className="text-gray-400 hover:text-red-600"
                        aria-label="Delete note"
                        type="button"
                      >
                        <Trash2 size={20} aria-hidden="true" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this note?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your note.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setNoteToDelete(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  {/* --- End AlertDialog --- */}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesPage;