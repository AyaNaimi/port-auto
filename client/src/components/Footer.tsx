export function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-8 md:px-6">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            © 2025 Smart Portfolio. Tous droits réservés.
          </p>
          <p className="text-sm text-muted-foreground">
            Propulsé par l'IA Hugging Face
          </p>
        </div>
      </div>
    </footer>
  );
}
