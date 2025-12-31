"use client";

import { formatDistanceToNow } from "date-fns";
import { id as localeId } from "date-fns/locale";
import type { Comment } from "@/types/comment";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MessageSquare, User } from "lucide-react";

interface CommentsListProps {
  comments: Comment[];
}

export function CommentsList({ comments }: CommentsListProps) {
  if (comments.length === 0) {
    return (
      <Card className="p-8">
        <div className="flex flex-col items-center justify-center text-center">
          <MessageSquare className="mb-4 h-12 w-12 text-muted-foreground" />
          <p className="text-muted-foreground">Belum ada komentar</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Jadilah yang pertama berkomentar tentang pemulihan ini
          </p>
        </div>
      </Card>
    );
  }

  // Helper to get user initial
  const getUserInitial = (name: string): string => {
    return name.charAt(0).toUpperCase();
  };

  // Check if comment is from official account
  const isOfficial = (userId: string): boolean => {
    return userId === "admin" || userId.startsWith("ngo-") || userId.startsWith("gov-");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold">
          {comments.length} Komentar
        </h4>
      </div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={comment.id}>
            <Card className="p-4">
              <div className="flex gap-3">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {comment.user_avatar ? (
                      <img
                        src={comment.user_avatar}
                        alt={comment.user_name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-semibold">
                        {getUserInitial(comment.user_name)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  {/* Header */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold">{comment.user_name}</span>
                    {isOfficial(comment.user_id) && (
                      <Badge variant="secondary" className="text-xs">
                        <User className="mr-1 h-3 w-3" />
                        Official
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      •{" "}
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: localeId,
                      })}
                    </span>
                  </div>

                  {/* Comment text */}
                  <p className="text-sm text-foreground">{comment.content}</p>
                </div>
              </div>
            </Card>

            {index < comments.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
