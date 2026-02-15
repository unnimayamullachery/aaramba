import './globals.css';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';

export const metadata = {
  title: 'Aaramba - Online Jewellery Store',
  description: 'Premium jewellery collection for all occasions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-white text-secondary">
        <Provider store={store}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Toaster position="top-right" />
        </Provider>
      </body>
    </html>
  );
}