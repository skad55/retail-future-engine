export default function StoresPage() {
  const stores = [
    { name: "Verdun", status: "Actif", variance: "+2.1%" },
    { name: "Rivoli", status: "Actif", variance: "-1.3%" },
    { name: "Bordeaux Centre", status: "Surveillance", variance: "-4.8%" },
  ];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-semibold text-slate-900">Magasins</h1>
      <p className="mt-1 text-sm text-slate-500">Vue rapide de la performance des points de vente.</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-4 py-3">Magasin</th>
              <th className="px-4 py-3">Statut</th>
              <th className="px-4 py-3">Écart vs prévision</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((store) => (
              <tr key={store.name} className="border-t border-slate-100">
                <td className="px-4 py-3 font-medium text-slate-900">{store.name}</td>
                <td className="px-4 py-3 text-slate-700">{store.status}</td>
                <td className="px-4 py-3 text-slate-700">{store.variance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
