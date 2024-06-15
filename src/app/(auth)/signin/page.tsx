"use client";
import { useSession } from "next-auth/react";

export default function Component() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button>Sign in</button>
    </>
  );
}
