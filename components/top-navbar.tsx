"use client";
import { SignInButton, useUser, UserButton } from "@clerk/nextjs";
import { OrganizationSwitcher, useOrganization } from "@clerk/clerk-react";
import { useEffect } from "react";

const TopNavbar: React.FC = () => {
  const { user } = useUser();
  const { organization } = useOrganization();

  useEffect(() => {
    const fetchProject = async () => {
      if (organization) {
        try {
          const response = await fetch(`/api/organizations/${organization.id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch organization data");
          }
          const data = await response.json();
          console.log("Fetched organization data:", data);
        } catch (error) {
          console.error("Error fetching organization data:", error);
        }
      }
    };

    fetchProject();
  }, [organization]);

  return (
    <div className="flex h-12 w-full items-center justify-between border-b px-4">
      <div className="flex items-center gap-x-2">
        <OrganizationSwitcher />
      </div>
      {user && (
        <div className="flex items-center gap-x-2">
          <span className="text-sm font-medium text-gray-600">
            {user?.fullName ?? user?.emailAddresses[0]?.emailAddress ?? "Guest"}
          </span>
          <UserButton afterSignOutUrl="/" />
        </div>
      )}
    </div>
  );
};

export { TopNavbar };
