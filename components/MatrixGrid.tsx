import { NestedShape, MissingCell, ShapeType } from './NestedShape';

export interface MatrixCell {
  outer: ShapeType;
  inner: ShapeType;
}

interface MatrixGridProps {
  cells: (MatrixCell | null)[][];
  cellSize?: number;
  className?: string;
}

export function MatrixGrid({ cells, cellSize = 72, className = '' }: MatrixGridProps) {
  return (
    <div
      className={`inline-grid grid-cols-3 gap-1 p-3 bg-white border-2 border-navy rounded-lg ${className}`}
    >
      {cells.flat().map((cell, i) => (
        <div
          key={i}
          className="flex items-center justify-center bg-white border border-divider rounded"
          style={{ width: cellSize + 8, height: cellSize + 8 }}
        >
          {cell ? (
            <NestedShape outer={cell.outer} inner={cell.inner} size={cellSize} />
          ) : (
            <MissingCell size={cellSize} />
          )}
        </div>
      ))}
    </div>
  );
}

interface AnswerOptionsProps {
  options: MatrixCell[];
  selectedIndex: number | undefined;
  onSelect: (index: number) => void;
  cellSize?: number;
}

export function AnswerOptions({
  options,
  selectedIndex,
  onSelect,
  cellSize = 64,
}: AnswerOptionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {options.map((opt, i) => {
        const selected = selectedIndex === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={`flex flex-col items-center gap-2 px-4 py-4 rounded-lg border-2 transition ${
              selected
                ? 'bg-blue-600/10 border-accent ring-2 ring-accent/30'
                : 'bg-white border-divider hover:border-navy'
            }`}
          >
            <span className="font-mono text-sm font-semibold text-navy">
              {String.fromCharCode(65 + i)}
            </span>
            <NestedShape outer={opt.outer} inner={opt.inner} size={cellSize} />
          </button>
        );
      })}
    </div>
  );
}
