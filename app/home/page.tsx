"use client";
import Link from "next/link";
import { CgGoogleTasks } from "react-icons/cg";
import { SignInButton } from "@clerk/clerk-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center gap-x-2" href="#">
          <div className="mt-1 flex items-center justify-center rounded-sm bg-[#FF5630] p-1 text-xs font-bold text-white">
            <CgGoogleTasks className="aspect-square text-2xl" />
          </div>
          <span className="font-bold">TodoHub</span>
        </Link>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Quản lý công việc của bạn với{" "}
                  <div className="mb-5 inline-block bg-gradient-to-r from-[#FF5630] via-[#FF8B00] to-[#FFC400] bg-clip-text text-transparent">
                    {" "}
                    TodoHub
                  </div>
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  TodoHub là phần mềm quản lý công việc mạnh mẽ giúp bạn sắp
                  xếp, theo dõi và hoàn thành mọi nhiệm vụ hiệu quả.
                </p>
              </div>
              <div className="space-x-4">
                <SignInButton>
                  <button
                    type="button"
                    className="rounded-3xl bg-gradient-to-r from-[#FF5630] via-[#FF8B00] to-[#FFC400] px-7 py-3 text-base font-medium text-white shadow-none transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#FF8B00] focus-visible:ring-4 focus-visible:ring-[#FF8B00]"
                  >
                    Bắt đầu ngay
                  </button>
                </SignInButton>
                <button
                  type="button"
                  className="rounded-3xl border border-[#FF5630] bg-white px-7 py-3 text-base font-medium text-[#FF5630] transition-colors duration-300 ease-in-out hover:bg-[#FF5630] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#FF8B00] focus-visible:ring-4 focus-visible:ring-[#FF8B00]"
                >
                  Tìm hiểu thêm
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 TodoHub. Tất cả các quyền được bảo lưu.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Điều khoản dịch vụ
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
            Chính sách bảo mật
          </Link>
        </nav>
      </footer>
    </div>
  );
}
