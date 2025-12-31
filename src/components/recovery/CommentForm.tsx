"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Loader2, Send, AlertCircle, CheckCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface CommentFormProps {
  recoveryPointId: string;
  onCommentPosted?: () => void;
}

export function CommentForm({
  recoveryPointId,
  onCommentPosted,
}: CommentFormProps) {
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("Komentar tidak boleh kosong");
      return;
    }

    if (content.length < 10) {
      setError("Komentar minimal 10 karakter");
      return;
    }

    setIsPosting(true);
    setError(null);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("Anda harus login untuk berkomentar. Fitur login akan segera hadir!");
        setIsPosting(false);
        return;
      }

      // Insert comment into Supabase
      const { error: dbError } = await supabase
        .from('comments')
        .insert({
          recovery_point_id: recoveryPointId,
          user_id: user.id,
          content: content.trim(),
        });

      if (dbError) {
        throw new Error(`Gagal memposting: ${dbError.message}`);
      }

      setSuccess(true);
      setContent("");

      // Reset success message after 2 seconds
      setTimeout(() => {
        setSuccess(false);
        onCommentPosted?.();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memposting komentar");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-2">
        <Textarea
          placeholder="Tulis komentar Anda... (min. 10 karakter)"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            setError(null);
          }}
          disabled={isPosting}
          rows={3}
          className="resize-none"
        />
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">
            {content.length} / 500 karakter
          </span>
          {content.length > 500 && (
            <span className="text-destructive">Terlalu panjang!</span>
          )}
        </div>
      </div>

      {error && (
        <Card className="border-destructive bg-destructive/10 p-3">
          <div className="flex items-center gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        </Card>
      )}

      {success && (
        <Card className="border-green-500 bg-green-500/10 p-3">
          <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
            <CheckCircle className="h-4 w-4" />
            Komentar berhasil diposting! 🎉
          </div>
        </Card>
      )}

      <Button
        type="submit"
        disabled={
          !content.trim() ||
          content.length < 10 ||
          content.length > 500 ||
          isPosting ||
          success
        }
        className="w-full"
      >
        {isPosting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Memposting...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Kirim Komentar
          </>
        )}
      </Button>
    </form>
  );
}
