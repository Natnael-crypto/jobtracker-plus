"use client";

import Link from "next/link";
import Image from "next/image";
import { useUnreadCount } from "@/hooks/useNotifications";

export default function TopNav() {
  const { data } = useUnreadCount();
  return (
    <div className="flex w-full justify-end items-center px-6 py-4 bg-white">
      <div className="flex items-center gap-x-6">
        <Link href="/business/notification" className="relative group">
          <Image
            src="/notification.svg"
            alt="Notifications"
            width={18}
            height={18}
            className="cursor-pointer transition-transform group-hover:scale-110"
          />
          {data! > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
          )}
        </Link>

        <Link href="/business/profile">
          <Image
            src="/user-icon.png"
            alt="User Account"
            width={24}
            height={24}
            className="rounded-full border border-gray-200 cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all"
          />
        </Link>
      </div>
    </div>
  );
}
