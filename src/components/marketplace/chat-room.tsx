"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ShieldCheck, Send, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { formatDate } from "@/lib/utils";
import type { Message } from "@/types/database";

type ChatRoomProps = {
  roomId: string;
  currentUserId: string;
  initialMessages: Message[];
  demoMode?: boolean;
};

export function ChatRoom({ roomId, currentUserId, initialMessages, demoMode = false }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const supabase = useMemo(() => (demoMode ? null : createClient()), [demoMode]);

  useEffect(() => {
    if (!supabase) return;

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
            if (current.some((m) => m.id === incoming.id)) return current;
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
    if (!nextText) return;

    setError(null);
    setText("");
    inputRef.current?.focus();

    if (demoMode) {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          chat_room_id: roomId,
          sender_id: currentUserId,
          text: nextText,
          created_at: new Date().toISOString()
        }
      ]);
      return;
    }

    startTransition(async () => {
      if (!supabase) {
        setText(nextText);
        setError("Supabase is not configured for live messaging.");
        return;
      }
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
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.05]">
      {/* Safety banner */}
      <div className="flex items-start gap-3 border-b border-amber-100 bg-amber-50 px-4 py-3">
        <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-amber-600" />
        <p className="text-xs leading-5 text-amber-800">
          <strong>Safe Meeting Zones:</strong> Student Union, library lobby, residence hall front desk, or Campus Police lot. Keep all details in this chat.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50/50 p-4" style={{ minHeight: 400, maxHeight: 520 }}>
        {messages.length === 0 ? (
          <div className="flex h-full items-center justify-center py-12 text-center text-sm text-slate-400">
            <div>
              <ShieldCheck className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              <p className="font-medium">No messages yet</p>
              <p className="mt-1">Start the conversation — remember to stay safe!</p>
            </div>
          </div>
        ) : null}

        {messages.map((message) => {
          const mine = message.sender_id === currentUserId;
          return (
            <div key={message.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`group relative max-w-[78%] rounded-2xl px-4 py-3 ${
                  mine
                    ? "bg-violet-600 text-white rounded-br-md"
                    : "bg-white text-slate-800 shadow-sm ring-1 ring-black/[0.05] rounded-bl-md"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-6">{message.text}</p>
                <p className={`mt-1 text-[10px] ${mine ? "text-violet-200" : "text-slate-400"}`}>
                  {formatDate(message.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Error */}
      {error ? (
        <div className="flex items-center gap-2 border-t border-red-100 bg-red-50 px-4 py-2.5 text-xs text-red-700">
          <AlertCircle className="h-3.5 w-3.5 flex-none" />
          {error}
        </div>
      ) : null}

      {/* Input */}
      <form
        className="flex items-end gap-3 border-t border-slate-100 bg-white p-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message… (Enter to send, Shift+Enter for newline)"
          className="min-w-0 flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-400 focus:border-violet-300 transition-shadow"
          rows={1}
          maxLength={1000}
          style={{ maxHeight: "120px" }}
        />
        <Button type="submit" disabled={isPending || !text.trim()} size="icon" className="shrink-0">
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
