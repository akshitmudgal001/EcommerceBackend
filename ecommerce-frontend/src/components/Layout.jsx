import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>
        {children}
      </main>
    </>
  );
}