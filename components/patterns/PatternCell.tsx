import { PatternCellData } from '@/data/patternTypes';
import { BlockConfig } from './BlockConfig';
import { CornerMark } from './CornerMark';
import { CountProgression } from './CountProgression';
import { FilledPosition } from './FilledPosition';
import { GridDensity } from './GridDensity';
import { LinePattern } from './LinePattern';
import { NestedShape } from './NestedShape';
import { OrientedBird } from './OrientedBird';

export function PatternCell({ data, size = 72 }: { data: PatternCellData; size?: number }) {
  switch (data.kind) {
    case 'nested':
      return <NestedShape outer={data.outer} inner={data.inner} size={size} />;
    case 'corner_marks':
      return <CornerMark markCorner={data.markCorner} size={size} />;
    case 'bird':
      return <OrientedBird facing={data.facing} size={size} />;
    case 'fill_position':
      return <FilledPosition shape={data.shape} corner={data.corner} size={size} />;
    case 'blocks':
      return <BlockConfig cells={data.cells} size={size} />;
    case 'lines':
      return <LinePattern variant={data.variant} size={size} />;
    case 'grid_density':
      return (
        <GridDensity
          gridSize={data.size}
          filled={data.filled}
          rotation={data.rotation ?? 0}
          size={size}
        />
      );
    case 'count':
      return <CountProgression dots={data.dots} size={size} />;
    default:
      return null;
  }
}

export function MissingPatternCell({ size = 72 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center bg-white border border-slate-200 rounded-lg"
      style={{ width: size + 12, height: size + 12 }}
    >
      <span className="text-3xl font-bold text-blue-600">?</span>
    </div>
  );
}

export function PatternMatrixGrid({
  grid,
  cellSize = 68,
}: {
  grid: (PatternCellData | null)[][];
  cellSize?: number;
}) {
  const cols = grid[0]?.length ?? 2;

  return (
    <div
      className="inline-grid gap-2 p-4 bg-white border border-slate-200 rounded-xl"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
    >
      {grid.flat().map((cell, i) => (
        <div key={i} className="flex items-center justify-center">
          {cell ? <PatternCell data={cell} size={cellSize} /> : <MissingPatternCell size={cellSize} />}
        </div>
      ))}
    </div>
  );
}

export function PatternOptionGrid({
  options,
  selectedIndex,
  onSelect,
  cellSize = 52,
}: {
  options: PatternCellData[];
  selectedIndex?: number;
  onSelect: (index: number) => void;
  cellSize?: number;
}) {
  return (
    <div className="grid grid-cols-2 grid-rows-3 gap-3">
      {options.map((opt, i) => {
        const selected = selectedIndex === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(i)}
            className={`flex flex-col items-center justify-center rounded-xl p-2 transition min-h-[88px] ${
              selected
                ? 'bg-slate-100 ring-2 ring-blue-600 ring-offset-1'
                : 'bg-slate-50 hover:bg-slate-100'
            }`}
          >
            <span className="text-xs font-mono text-slate-500 mb-1">{String.fromCharCode(65 + i)}</span>
            <PatternCell data={opt} size={cellSize} />
          </button>
        );
      })}
    </div>
  );
}
