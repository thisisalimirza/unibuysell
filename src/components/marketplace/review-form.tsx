"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { createReviewAction } from "@/app/chats/actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type ReviewFormProps = {
  transactionId: string;
  revieweeId: string;
  revieweeName: string;
};

function SubmitReviewButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Submitting..." : "Submit review"}
    </Button>
  );
}

export function ReviewForm({ transactionId, revieweeId, revieweeName }: ReviewFormProps) {
  const [state, action] = useActionState(createReviewAction, {});

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="transactionId" value={transactionId} />
      <input type="hidden" name="revieweeId" value={revieweeId} />
      <div className="space-y-2">
        <Label htmlFor="rating">Rate {revieweeName}</Label>
        <Select id="rating" name="rating" defaultValue="5">
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} star{rating === 1 ? "" : "s"}
            </option>
          ))}
        </Select>
      </div>
      <div className="space-y-2">
        <Label htmlFor="comment">Review</Label>
        <Textarea id="comment" name="comment" required placeholder="Was the item accurate and meetup safe?" />
      </div>
      {state.error || state.success ? (
        <div
          className={`rounded-xl border p-3 text-sm ${
            state.error
              ? "border-red-200 bg-red-50 text-red-700"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          {state.error ?? state.success}
        </div>
      ) : null}
      <SubmitReviewButton />
    </form>
  );
}
