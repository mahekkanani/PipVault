import { FlaskConical, Search } from 'lucide-react';
import Button from './Button.jsx';
import { Input, Select } from './Field.jsx';

export default function BacktestFilters({ filters, onFiltersChange, pairs, strategies, onAddBacktest }) {
  return (
    <div className="grid gap-3 rounded-lg border border-cyan-400/15 bg-slate-950/80 p-4 shadow-glow lg:grid-cols-[minmax(220px,1fr)_repeat(5,minmax(120px,auto))_auto] lg:items-center">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/70" size={18} />
        <Input
          value={filters.search}
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
          placeholder="Search strategy, pair, mistake, notes..."
          className="pl-10"
        />
      </div>
      <Select
        aria-label="Filter by strategy"
        value={filters.strategy}
        onChange={(event) => onFiltersChange({ ...filters, strategy: event.target.value })}
      >
        <option>All</option>
        {strategies.map((strategy) => (
          <option key={strategy}>{strategy}</option>
        ))}
      </Select>
      <Select
        aria-label="Filter by pair"
        value={filters.pair}
        onChange={(event) => onFiltersChange({ ...filters, pair: event.target.value })}
      >
        <option>All</option>
        {pairs.map((pair) => (
          <option key={pair}>{pair}</option>
        ))}
      </Select>
      <Select
        aria-label="Filter by side"
        value={filters.side}
        onChange={(event) => onFiltersChange({ ...filters, side: event.target.value })}
      >
        <option>All</option>
        <option>Buy</option>
        <option>Sell</option>
      </Select>
      <Select
        aria-label="Filter by setup grade"
        value={filters.setupGrade}
        onChange={(event) => onFiltersChange({ ...filters, setupGrade: event.target.value })}
      >
        <option>All</option>
        <option>A+</option>
        <option>A</option>
        <option>B</option>
        <option>C</option>
      </Select>
      <Select
        aria-label="Filter by rule following"
        value={filters.followedRules}
        onChange={(event) => onFiltersChange({ ...filters, followedRules: event.target.value })}
      >
        <option>All</option>
        <option>Yes</option>
        <option>No</option>
      </Select>
      <Button onClick={onAddBacktest} className="shrink-0">
        <FlaskConical size={18} />
        Add Backtest
      </Button>
    </div>
  );
}
