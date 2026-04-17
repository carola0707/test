import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center">
      <div className="text-center">
        <h1 className="mb-4 text-foreground">404</h1>
        <p className="mb-4 text-lg text-muted-foreground">Page not found</p>
        <a href="/" className="text-primary font-medium hover:underline">
          Return to Home
        </a>
      </div>
    </main>
  );
};

export default NotFound;
