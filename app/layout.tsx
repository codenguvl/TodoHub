import { ClerkProvider } from "@clerk/nextjs";
import { type Metadata } from "next";
import { siteConfig } from "@/config/site";
import "@/styles/globals.css";
import "@radix-ui/themes/styles.css";
import Toaster from "@/components/toast";
import QueryProvider from "@/utils/provider";
import { AuthModalProvider } from "@/context/use-auth-modal";
import { AuthModal } from "@/components/modals/auth";
import { Arimo } from "next/font/google";
import { viVN } from "@clerk/localizations";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Jira",
    "Next.js",
    "React",
    "Tailwind CSS",
    "Server Components",
    "Radix UI",
    "Clerk",
    "TanStack",
  ],
  authors: [
    {
      name: "Sebastian Fernandez",
      url: "https://sebastianfdz.com",
    },
  ],
  creator: "Sebastian Fernandez",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
};
const arimo = Arimo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={arimo.className}>
        <ClerkProvider localization={viVN}>
          <QueryProvider>
            <AuthModalProvider>
              <AuthModal />
              <Toaster
                position="bottom-left"
                reverseOrder={false}
                containerStyle={{
                  height: "92vh",
                  marginLeft: "3vw",
                }}
              />
              {children}
            </AuthModalProvider>
          </QueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
};

export default RootLayout;
