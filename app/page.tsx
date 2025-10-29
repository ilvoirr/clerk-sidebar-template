"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

function RedirectToApp({ router }: { router: ReturnType<typeof useRouter> }) {
  useEffect(() => {
    router.push("/page-one");
  }, [router]);
  return null;
}

// Helper to get all page images from public
function getPageImages(): string[] {
  // Hardcode up to N, or fetch from server if SSR
  // For hackathons, let's loop up to page20.png
  const images = [];
  for (let i = 1; i <= 20; i++) {
    images.push(`/page${i}.png`);
  }
  return images;
}

export default function HomePage() {
  const router = useRouter();
  const [navbarBg, setNavbarBg] = useState('#f0fce4');

  // Dynamic navbar background (same as your template, keep logic)
  useEffect(() => {
    const handleScroll = () => {
      const vh = window.innerHeight;
      const maxScrollLimit = vh * 3.87;
      if (window.scrollY > maxScrollLimit) {
        window.scrollTo(0, maxScrollLimit);
        return;
      }
      const navbarHeightPx = (6 / 100) * vh;
      const scrollY = window.scrollY;
      const navbarBottom = scrollY + navbarHeightPx;
      if (navbarBottom >= vh * 2 || navbarBottom >= vh * 1) {
        setNavbarBg('#ffffff');
      } else {
        setNavbarBg('#f0fce4');
      }
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Detect which pageX.png exist in public by trying to load images
  // This requires a little workaround: just render all, hidden if 404

  const pageImages = getPageImages();

  return (
    <div className="overflow-x-hidden">
      {/* Signed in redirect */}
      <SignedIn>
        <RedirectToApp router={router} />
      </SignedIn>

      {/* Navbar CSS moved exactly */}
      <style>
        {`
          @media (min-width: 1300px) and (max-width: 1400px) {
            .only-1366 {
              font-size: 1.6vh;
            }
          }
          .navbar-transition {
            transition: background-color 0.3s ease;
          }
        `}
      </style>

      <div 
        className="navbar-transition fixed top-0 left-0 w-full flex items-center justify-between h-[6vh] text-white px-4 md:px-8 z-50"
        style={{ backgroundColor: navbarBg }}
      >
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24" height="24" viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#48837e] w-[5vh] h-[5vh] md:w-[4.9vh] md:h-[4.9vh]"
          >
            <path d="M11 17h3v2a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3a3.16 3.16 0 0 0 2-2h1a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h-1a5 5 0 0 0-2-4V3a4 4 0 0 0-3.2 1.6l-.3.4H11a6 6 0 0 0-6 6v1a5 5 0 0 0 2 4v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1z"/>
            <path d="M16 10h.01"/>
            <path d="M2 8v1a2 2 0 0 0 2 2h1"/>
          </svg>
          <h1 className="hidden md:inline-flex text-[1.6vw] font-semibold tracking-tight text-[#48837e] ml-3">
            pageN.png in public folder + adjust navbar color manually
          </h1>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <SignedOut>
        <SignInButton forceRedirectUrl="/page-one">
  <Button className="only-1366 bg-transparent text-[#48837e] hover:text-white hover:bg-[#48837e] md:text-[1.77vh] text-[4vw] px-3 md:px-4">
    Login
  </Button>
</SignInButton>

<SignUpButton 
  forceRedirectUrl="/page-one"
  signInForceRedirectUrl="/page-one"
>
  <Button className="only-1366 bg-white text-[#48837e] hover:bg-[#48837e] hover:text-white md:text-[1.77vh] text-[4vw] px-3 md:px-6">
    Sign Up
  </Button>
</SignUpButton>

          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>

      {/* Renders all page images in /public/pageX.png as full-screen sections */}
      {pageImages.map((src, i) => (
        <PageImageSection src={src} key={i} />
      ))}

      {/* Spacer for footer if needed */}
      <div style={{ height: "10vh" }}></div>
    </div>
  );
}

// A helper component to show .png only if found in public, fallback to nothing
function PageImageSection({ src }: { src: string }) {
  const [exists, setExists] = useState(true);
  useEffect(() => {
    // Check if image actually exists
    const img = new window.Image();
    img.src = src;
    img.onload = () => setExists(true);
    img.onerror = () => setExists(false);
  }, [src]);
  if (!exists) return null;
  return (
    <div className="w-screen h-screen">
      <img
        src={src}
        alt={src}
        className="w-full h-full object-cover"
        draggable={false}
      />
    </div>
  );
}
