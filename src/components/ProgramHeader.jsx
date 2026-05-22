export default function ProgramHeader({ subtitle }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-stone-900 pb-2 mb-6">
      <div className="flex items-baseline gap-3">
        <div className="f-display text-2xl">ROAD&nbsp;TO&nbsp;THE&nbsp;CUP</div>
        <div className="f-serif-i text-sm text-stone-600">an English challenge</div>
      </div>
      <div className="f-mono text-xs uppercase text-stone-600">{subtitle}</div>
    </div>
  );
}
