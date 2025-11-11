'use client';

import { useState } from 'react';
import { Home, Search, Bell, Mail, Bookmark, User, MoreHorizontal, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

const navigation = [
  { name: 'Home', href: '#', icon: Home, current: true },
  { name: 'Explore', href: '#', icon: Search, current: false },
  { name: 'Notifications', href: '#', icon: Bell, current: false },
  { name: 'Messages', href: '#', icon: Mail, current: false },
  { name: 'Bookmarks', href: '#', icon: Bookmark, current: false },
  { name: 'Profile', href: '#', icon: User, current: false },
  { name: 'More', href: '#', icon: MoreHorizontal, current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function XMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
    
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="fixed left-4 top-4 z-50 md:hidden"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-[#000000] p-0">
            <VisuallyHidden>
      <SheetTitle>X Navigation</SheetTitle>
    </VisuallyHidden>
          <SidebarContent setSidebarOpen={setSidebarOpen} />
        </SheetContent>
      </Sheet>
      <div className="hidden z-10  md:inset-y-0 md:flex md:w-80 md:flex-col">
        <SidebarContent setSidebarOpen={() => {}} />
      </div>
      

    
    </>
  );
}

function SidebarContent({ setSidebarOpen }: { setSidebarOpen: (open: boolean) => void }) {
  return (
    <div className="flex h-screen  flex-col bg-[#0f0f0f]">
      <div className="flex h-10 shrink-0 items-center px-4">
    
      </div>
      <nav className="flex-1 space-y-4 px-2 py-4">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
            onClick={() => setSidebarOpen(false)}
            className={classNames(
              item.current
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-900 hover:text-white',
              'group flex items-center rounded-full px-2 py-3 text-xl font-medium transition-colors'
            )}
          >
            <item.icon
              className={classNames(
                item.current ? 'text-white' : 'text-gray-400 group-hover:text-white',
                'mr-4 h-7 w-7 shrink-0'
              )}
              aria-hidden="true"
            />
            <span className="truncate">{item.name}</span>
          </a>
        ))}
      </nav>

      <Separator className="bg-gray-800" />
     
    </div>
  );
}