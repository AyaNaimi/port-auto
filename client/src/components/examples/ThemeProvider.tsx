import { ThemeProvider as Provider } from "../ThemeProvider";
import { Button } from "@/components/ui/button";
import { useTheme } from "../ThemeProvider";

function ThemeToggleDemo() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div className="p-8 space-y-4">
      <p>Current theme: {theme}</p>
      <Button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
        Toggle Theme
      </Button>
    </div>
  );
}

export default function ThemeProviderExample() {
  return (
    <Provider>
      <ThemeToggleDemo />
    </Provider>
  );
}
