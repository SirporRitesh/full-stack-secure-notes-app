import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const NoteEditorPage: React.FC = () => {
  const { noteId } = useParams<{ noteId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch initial note data only once
  useEffect(() => {
    api.get(`/notes/${noteId}`)
      .then(res => {
        setTitle(res.data.note.title);
        setContent(res.data.note.content);
      })
      .catch(err => {
        toast({ title: "Error fetching note", variant: "destructive" });
        navigate("/dashboard");
      })
      .finally(() => setLoading(false));
  }, [noteId, navigate]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put(`/notes/${noteId}`, {
        title: title,
        content: content,
      });
      toast({ title: "Note saved successfully!" });
      navigate("/dashboard");
    } catch (err) {
      toast({ title: "Failed to save note", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div>Loading note...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Note</h1>
      <div className="space-y-4">
        <Input
          placeholder="Note Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-xl font-semibold h-12"
        />
        <Textarea
          placeholder="Start writing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] text-base"
        />
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Note"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditorPage;