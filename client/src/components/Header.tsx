import { Link, useLocation } from "wouter";
import { Moon, Sun, Sparkles, User, LogOut, LayoutDashboard, FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { user, appUser, signOut, isAdmin } = useAuth();
  const [, setLocation] = useLocation();

  const handleSignOut = async () => {
    await signOut();
    setLocation('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 hover-elevate rounded-md px-3 py-2" data-testid="link-home">
          <Sparkles className="h-6 w-6 text-primary" />
          <span className="bg-gradient-to-r from-[hsl(var(--gradient-from))] to-[hsl(var(--gradient-to))] bg-clip-text text-xl font-bold text-transparent font-heading">
            Smart Portfolio
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Button
                variant="ghost"
                onClick={() => setLocation('/my-portfolios')}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                My Portfolios
              </Button>
              {isAdmin && (
                <Button
                  variant="ghost"
                  onClick={() => setLocation('/admin')}
                >
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Admin
                </Button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {appUser?.username || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setLocation('/my-portfolios')}>
                    <FolderOpen className="h-4 w-4 mr-2" />
                    My Portfolios
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem onClick={() => setLocation('/admin')}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Admin Dashboard
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setLocation('/login')}>
                Login
              </Button>
              <Button onClick={() => setLocation('/register')}>
                Register
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            data-testid="button-theme-toggle"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
