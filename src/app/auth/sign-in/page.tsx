import { signInAction } from "@/app/auth/actions";
import { AuthForm } from "@/components/marketplace/auth-form";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ message?: string }>;
}) {
  const { message } = await searchParams;

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-7xl items-center justify-center px-4 py-12">
      <AuthForm mode="sign-in" action={signInAction} message={message} />
    </main>
  );
}
