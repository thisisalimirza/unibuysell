"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ShieldCheck, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Message } from "@/types/database";

type ChatRoomProps = {
  roomId: string;
  currentUserId: string;
  initialMessages: Message[];
};

export function ChatRoom({ roomId, currentUserId, initialMessages }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const channel = supabase
      .channel(`chat-room:${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${roomId}`
        },
        (payload) => {
          setMessages((current) => {
            const incoming = payload.new as Message;
            if (current.some((message) => message.id === incoming.id)) {
              return current;
            }
            return [...current, incoming];
          });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [roomId, supabase]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  function sendMessage() {
    const nextText = text.trim();
    if (!nextText) {
      return;
    }

    setError(null);
    setText("");
    startTransition(async () => {
      const { error: sendError } = await supabase.from("messages").insert({
        chat_room_id: roomId,
        sender_id: currentUserId,
        text: nextText
      });

      if (sendError) {
        setText(nextText);
        setError(sendError.message);
      }
    });
  }

  return (
    <div className="flex h-[680px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <div className="flex items-start gap-2">
          <ShieldCheck className="mt-0.5 h-5 w-5 flex-none" />
          <p>
            Meet only in on-campus Safe Meeting Zones: Student Union, library lobby, residence hall
            front desk, or Campus Police parking lot. Keep payment and pickup details in this chat.
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50 p-4">
        {messages.map((message) => {
          const mine = message.sender_id === currentUserId;
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-4 py-3 shadow-sm ${
                  mine ? "bg-primary text-primary-foreground" : "bg-white text-slate-800"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                <p className={`mt-1 text-[11px] ${mine ? "text-blue-100" : "text-slate-400"}`}>
                  {formatDate(message.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {error ? <div className="border-t border-red-100 bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

      <form
        className="flex gap-3 border-t border-slate-200 bg-white p-4"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Write a secure message..."
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          maxLength={1000}
        />
        <Button type="submit" disabled={isPending || !text.trim()}>
          <Send className="h-4 w-4" />
          Send
        </Button>
      </form>
    </div>
  );
}
