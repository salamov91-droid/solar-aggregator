import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Solar Solutions Aggregator',
  description: 'Каталог солнечных решений с подгрузкой цен партнёров, калькулятором подбора и расчётом под ключ.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
