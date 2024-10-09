import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import QuestionList from "./ListApproach/QuestionList.jsx";
export const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
    mutations: {
      retry: 2,
    },
  },
});
const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path:"/",
        element:<QuestionList></QuestionList>
      },
    ],
  },
]);
createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={qc}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
