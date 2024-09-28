"use client";
import { SignIn } from "@clerk/clerk-react";

const Signin = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
      <SignIn
        path="/sign-in"
        redirectUrl={"/project/roadmap"}
        signUpUrl="/sign-up"
      />
    </div>
  );
};

export default Signin;
