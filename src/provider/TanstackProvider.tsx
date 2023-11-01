"use client";
import { NextPage } from "next";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
interface Props {
  children: React.ReactNode;
}

const TanstackProvider: NextPage<Props> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default TanstackProvider;
