import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";

test("renders learn react link", () => {
  render(
    <AuthProvider>
      <App />
    </AuthProvider>
  );
  const linkElement = screen.getByText(/invoice/i);
  expect(linkElement).toBeInTheDocument();
});
