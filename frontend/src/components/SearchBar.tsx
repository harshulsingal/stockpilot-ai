type Props = {
  ticker: string;
  setTicker: (ticker: string) => void;
  onSearch: () => void;
};

export default function SearchBar({
  ticker,
  setTicker,
  onSearch,
}: Props) {
  return (
    <div>
      <input
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Enter ticker"
      />

      <button onClick={onSearch}>
        Search
      </button>
    </div>
  );
}