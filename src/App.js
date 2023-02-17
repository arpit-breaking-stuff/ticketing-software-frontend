import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TicketDetails from './pages/ticketDetails/TicketDetails';

function App() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 5,
        refetchInterval: 5000,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      <h1>
        This is supposed to look like notion (eventually)
      </h1>

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/ticket/:ticketId' element={<TicketDetails />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
