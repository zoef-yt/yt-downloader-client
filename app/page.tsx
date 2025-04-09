import { MediaDownloader } from '@/components/pages/home/mediaDownloader';

export default function Home() {
	return (
		<div className='min-h-screen flex flex-col font-[family-name:var(--font-lora)]'>
			<MediaDownloader />
			<footer className='mt-auto w-full text-center text-zinc-500 transition-colors duration-300 pb-6 pt-12 bg-zinc-900'>
				<a
					href='https://zoef.dev'
					target='_blank'
					rel='noopener noreferrer'
					className='inline-block underline underline-offset-4 hover:no-underline hover:scale-[1.02] transition-all duration-200'
				>
					made by <span className='font-semibold tracking-wide text-indigo-400'>zoef</span>.
				</a>
			</footer>
		</div>
	);
}
