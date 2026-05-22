export default function StatBox({ label, value, accent }) {
  return (
    <div className="border-2 border-stone-900 p-4 text-center">
      <div className="f-mono text-[10px] uppercase tracking-widest text-stone-600 mb-1">{label}</div>
      <div className="f-display text-5xl leading-none" style={{ color: accent }}>{value}</div>
    </div>
  );
}
