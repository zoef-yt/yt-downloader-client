import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import './globals.css';

const lora = Lora({
	variable: '--font-lora',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'Media downloader',
	description: 'Download media in audio and video formats',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`${lora.variable} antialiased`}>
				{children}
			</body>
		</html>
	);
}
