// app/components/Layout.tsx

const Layout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div>
        <header className="bg-gradient-to-r from-green-400 via-teal-500 to-blue-500 p-4 text-white">
          <nav>
            {/* Removed Home and News links */}
          </nav>
        </header>
        <main>{children}</main>
        <footer className="bg-gray-800 text-white text-center p-4">
          <p>© 2024 Financial Literacy Website. All rights reserved.</p>
        </footer>
      </div>
    );
  };
  
  export default Layout;
  


