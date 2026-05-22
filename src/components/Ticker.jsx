export default function Ticker({ items }) {
  const repeated = [...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-stone-900" style={{ backgroundColor: '#FFD500' }}>
      <div className="anim-ticker inline-flex whitespace-nowrap py-1.5">
        {repeated.map((it, i) => (
          <span key={i} className="f-display text-lg uppercase mx-6 inline-flex items-center gap-3">
            {it}
            <span className="text-stone-900">★</span>
          </span>
        ))}
      </div>
    </div>
  );
}
