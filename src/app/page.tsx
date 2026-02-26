import { getAllModules } from "@/lib/modules";
import { ModuleCard } from "@/components/ui/ModuleCard";

export default function Home() {
  const modules = getAllModules();

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Magnetism Unplugged
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          An interactive journey through magnetism — no physics background
          required. Build real intuition through plain-language explanations and
          hands-on visualizations.
        </p>
      </header>

      {modules.length > 0 ? (
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Modules
          </h2>
          <div className="space-y-3">
            {modules.map((mod) => (
              <ModuleCard key={mod.slug} module={mod} />
            ))}
          </div>
        </section>
      ) : (
        <section className="text-center py-16">
          <p className="text-gray-500 text-lg">
            Modules are coming soon. Check back shortly!
          </p>
        </section>
      )}
    </div>
  );
}
