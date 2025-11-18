"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import LoginWidget from "./LoginWidget";
import useAuthGuard from "../hooks/useAuthGuard";
import AuthModal from "./AuthModal";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { showAuthModal, setShowAuthModal, user } = useAuthGuard();

  const handleSelectLocation = () => {
    console.log("selected");
  };

  return (
    <header
      style={{
        width: "100%",
        justifyContent:'center',
        alignItems:'center',
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* AUTH MODAL */}
      {showAuthModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowAuthModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <AuthModal
              open={showAuthModal}
              onClose={() => setShowAuthModal(false)}
              onSelect={handleSelectLocation}
            />
          </div>
        </div>
      )}

      {/* MAIN HEADER WRAPPER */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 40px",
        }}
      >
        {/* LOGO */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <a
            href="/"
            style={{
              fontFamily: "Playfair Display",
              fontSize: "26px",
              fontWeight: 700,
              background:
                "linear-gradient(180deg, var(--gold-light), var(--gold-dark))",
              WebkitTextFillColor: "transparent",
              WebkitBackgroundClip: "text",
              letterSpacing: "0.5px",
              textDecoration: "none",
            }}
          >
            StrayPals
          </a>
        </div>

        {/* DESKTOP NAV */}
        <nav
          className="desktop-nav"
          style={{
            display: "none",
            alignItems: "center",
            gap: "36px",
          }}
        >
          <HeaderLink href="/" user={user} setShowAuthModal={setShowAuthModal}>
            Home
          </HeaderLink>
          <HeaderLink
            href="/report"
            user={user}
            setShowAuthModal={setShowAuthModal}
          >
            Report
          </HeaderLink>
          <HeaderLink
            href="/strays"
            user={user}
            setShowAuthModal={setShowAuthModal}
          >
            Strays
          </HeaderLink>
          <HeaderLink
            href="/community"
            user={user}
            setShowAuthModal={setShowAuthModal}
          >
            Community
          </HeaderLink>
          <HeaderLink
            href="/tasks"
            user={user}
            setShowAuthModal={setShowAuthModal}
          >
            Tasks
          </HeaderLink>
          <HeaderLink
            href="/stations"
            user={user}
            setShowAuthModal={setShowAuthModal}
          >
            Stations
          </HeaderLink>
          <HeaderLink
            href="/pass-the-bowl"
            user={user}
            setShowAuthModal={setShowAuthModal}
          >
            Pass the Bowl
          </HeaderLink>

          <LoginWidget />
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          className="mobile-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: "block",
            background: "rgba(207,168,92,0.15)",
            border: "1px solid rgba(207,168,92,0.4)",
            padding: "8px",
            borderRadius: "8px",
            color: "var(--gold)",
          }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "rgba(0,0,0,0.8)",
            borderTop: "1px solid rgba(207,168,92,0.3)",
            padding: "16px",
          }}
        >
          <MobileHeaderLink href="/">Home</MobileHeaderLink>
          <MobileHeaderLink href="/report">Report</MobileHeaderLink>
          <MobileHeaderLink href="/spotted">Spotted</MobileHeaderLink>
          <MobileHeaderLink href="/community">Community</MobileHeaderLink>
          <MobileHeaderLink href="/tasks">Tasks</MobileHeaderLink>
          <MobileHeaderLink href="/stations">Stations</MobileHeaderLink>
          <MobileHeaderLink href="/pass-the-bowl">
            Pass the Bowl
          </MobileHeaderLink>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 1024px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}

function HeaderLink({ href, children, user, setShowAuthModal }) {
  return (
    <a
      href={href}
      onClick={(e) => {
        if (!user && href !== "/") {
          e.preventDefault();
          setShowAuthModal(true);
        }
      }}
      style={{
        fontSize: "14px",
        color: "rgba(255,255,255,0.85)",
        textDecoration: "none",
        transition: "0.3s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--gold-light)")}
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = "rgba(255,255,255,0.85)")
      }
    >
      {children}
    </a>
  );
}

function MobileHeaderLink({ href, children }) {
  return (
    <a
      href={href}
      style={{
        display: "block",
        padding: "12px 0",
        fontSize: "18px",
        color: "var(--gold-light)",
        textDecoration: "none",
      }}
    >
      {children}
    </a>
  );
}
