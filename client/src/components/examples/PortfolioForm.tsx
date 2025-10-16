import { PortfolioForm } from "../PortfolioForm";

export default function PortfolioFormExample() {
  return (
    <div className="py-12 px-4">
      <PortfolioForm
        onSubmit={(data) => console.log("Form submitted:", data)}
      />
    </div>
  );
}
