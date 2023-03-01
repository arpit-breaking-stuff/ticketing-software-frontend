import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/home';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TicketDetails from './pages/ticketDetails/TicketDetails';
import Header from './components/header/Header';

function App() {

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 5,
      },
    },
  })
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/ticket/:ticketId' element={<TicketDetails />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
