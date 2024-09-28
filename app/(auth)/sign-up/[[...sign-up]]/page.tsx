"use client";
import { SignUp } from "@clerk/clerk-react";

const Signup = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <SignUp
        path="/sign-up"
        redirectUrl={"/project/roadmap"}
        signInUrl="/sign-in"
      />
    </div>
  );
};

export default Signup;
