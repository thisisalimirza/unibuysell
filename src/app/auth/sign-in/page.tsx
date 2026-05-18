import { signInAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/marketplace/auth-form";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-violet-100 opacity-60 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-100 opacity-60 blur-3xl" />
      </div>
      <AuthForm mode="sign-in" action={signInAction} message={message} />
    </main>
  );
}
