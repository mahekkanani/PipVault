import { Plus, Search } from 'lucide-react';
import Button from './Button.jsx';
import { Input, Select } from './Field.jsx';

export default function TradeFilters({ filters, onFiltersChange, pairs, onAddTrade }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-cyan-400/15 bg-slate-950/80 p-4 shadow-glow md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-cyan-300/70" size={18} />
        <Input
          value={filters.search}
          onChange={(event) => onFiltersChange({ ...filters, search: event.target.value })}
          placeholder="Search pair, notes, session, emotion..."
          className="pl-10"
        />
      </div>
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
        aria-label="Filter by pair"
        value={filters.pair}
        onChange={(event) => onFiltersChange({ ...filters, pair: event.target.value })}
      >
        <option>All</option>
        {pairs.map((pair) => (
          <option key={pair}>{pair}</option>
        ))}
      </Select>
      <Button onClick={onAddTrade} className="shrink-0">
        <Plus size={18} />
        Add Trade
      </Button>
    </div>
  );
}
