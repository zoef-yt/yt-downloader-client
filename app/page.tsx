import { YoutubeDownloader } from '@/components/pages/home/youtubeDownloader';

export default function Home() {
	return (
		<div className='min-h-screen flex flex-col p-6 pb-20 sm:p-20 font-[family-name:var(--font-lora)]'>
			<YoutubeDownloader />
		</div>
	);
}
