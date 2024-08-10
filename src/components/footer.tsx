export function Footer() {
  return (
    <footer className="mt-20 mb-8">
      <p className="text-neutral-600 text-md flex justify-between font-serif">
        © {new Date().getFullYear()}.<span>♠</span>
      </p>
    </footer>
  );
}
