export default function DataPage() {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Upload des données</h1>
      <p className="mt-1 text-sm text-slate-500">Importez vos exports CSV pour alimenter les prévisions.</p>

      <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <p className="text-sm text-slate-700">Glissez-déposez un fichier CSV ici ou cliquez pour sélectionner.</p>
        <button
          type="button"
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          Choisir un fichier
        </button>
      </div>
    </section>
  );
}
