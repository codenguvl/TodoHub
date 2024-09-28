"use client";
import { CreateOrganization } from "@clerk/clerk-react";

const Signin = () => {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center gap-6">
      <CreateOrganization
        path="/create-organization"
        afterCreateOrganizationUrl="/project/roadmap"
      />
    </div>
  );
};

export default Signin;
