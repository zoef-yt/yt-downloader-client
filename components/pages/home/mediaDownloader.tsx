'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircleIcon, CheckCircleIcon, DownloadIcon, Loader2 } from 'lucide-react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

import { DOWNLOAD_OPTIONS, FORM_DEFAULT_VALUES } from '@/lib/constants';
import { formSchema } from '@/lib/schema';
import type { formSchemaType } from '@/lib/type';
import { downloadVideo } from '@/lib/download';

export function MediaDownloader() {
	const [isLoading, setIsLoading] = useState(false);
	const [message, setMessage] = useState('');
	const [progress, setProgress] = useState<number | null>(null);
	const [anim] = useAutoAnimate();

	const form = useForm<formSchemaType>({
		resolver: zodResolver(formSchema),
		defaultValues: FORM_DEFAULT_VALUES,
	});

	const onSubmit = async ({ extension, type, ytUrl }: formSchemaType) => {
		const id = uuidv4();
		setIsLoading(true);
		setMessage('');
		setProgress(null);

		try {
			const filename = await downloadVideo({
				ytUrl,
				type,
				extension,
				id,
				onProgress: (progress) => setProgress(progress),
				messageSetter: (msg) => setMessage(msg),
			});
			setMessage(`Downloaded: ${filename}`);
		} catch (error) {
			setMessage(error instanceof Error ? error.message : 'Download failed.');
		} finally {
			setProgress(null);
			setIsLoading(false);
		}
	};

	return (
		<div className='flex-1 flex items-center justify-center bg-zinc-900 relative overflow-hidden'>
			<div className='absolute inset-0 z-0 animate-gradient bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-500 via-purple-500 to-zinc-900 opacity-20 blur-3xl' />
			<div className="absolute inset-0 z-0 pointer-events-none bg-[url('/noise.svg')] opacity-10" />
			<div className='w-full max-w-xl px-4 z-10'>
				<Card className='rounded-3xl border border-white/10 bg-white/5 backdrop-blur-lg shadow-[0_0_50px_rgba(128,90,213,0.2)] transition-all duration-500'>
					<CardContent className='p-8 sm:p-10 space-y-6 relative'>
						<h2 className='text-4xl font-extrabold text-center tracking-tight text-white drop-shadow-[0_0_4px_rgba(255,255,255,0.25)]'>
							Media{' '}
							<span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-400 to-pink-400 animate-gradient-x'>
								Grabber
							</span>
						</h2>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6' ref={anim}>
								<FormField
									control={form.control}
									name='ytUrl'
									render={({ field }) => (
										<FormItem>
											<FormLabel className='text-sm font-semibold text-zinc-300'>Video URL</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder='https://somewebsite.com/watch?v=...'
													className='h-12 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-inner hover:shadow-lg'
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<div className='flex flex-col sm:flex-row gap-4'>
									<FormField
										control={form.control}
										name='type'
										render={({ field }) => (
											<FormItem className='flex-1'>
												<FormLabel className='text-sm font-semibold text-zinc-300'>Format</FormLabel>
												<Select
													value={field.value}
													onValueChange={(val) => {
														form.setValue('extension', DOWNLOAD_OPTIONS[val].extensions[0]);
														field.onChange(val);
													}}
												>
													<FormControl>
														<SelectTrigger className='cursor-pointer h-12 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white transition-all hover:border-purple-500 focus:ring-purple-500'>
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent className='bg-zinc-900 border-zinc-700 backdrop-blur-lg text-white rounded-xl shadow-xl'>
														{Object.entries(DOWNLOAD_OPTIONS).map(([key, val]) => (
															<SelectItem key={key} value={key} className='hover:bg-purple-500/10 cursor-pointer'>
																{val.label}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name='extension'
										render={({ field }) => {
											const selectedType = form.watch('type');
											return (
												<FormItem className='flex-1'>
													<FormLabel className='text-sm font-semibold text-zinc-300'>Extension</FormLabel>
													<Select value={field.value} onValueChange={field.onChange}>
														<FormControl>
															<SelectTrigger className='cursor-pointer h-12 rounded-xl bg-zinc-800/60 border border-zinc-700 text-white transition-all hover:border-purple-500 focus:ring-purple-500'>
																<SelectValue placeholder='Select extension' />
															</SelectTrigger>
														</FormControl>
														<SelectContent className='bg-zinc-900 border-zinc-700 backdrop-blur-lg text-white rounded-xl shadow-xl'>
															{DOWNLOAD_OPTIONS[selectedType].extensions.map((ext) => (
																<SelectItem key={ext} value={ext} className='hover:bg-purple-500/10 cursor-pointer'>
																	{ext}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
												</FormItem>
											);
										}}
									/>
								</div>

								<div className='space-y-5 pt-2'>
									<Button
										type='submit'
										disabled={isLoading}
										className='cursor-pointer w-full h-14 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white text-lg font-semibold shadow-lg transition-transform duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60'
									>
										{isLoading ? (
											<div className='flex items-center justify-center gap-2'>
												<Loader2 className='animate-spin h-5 w-5' />
												{progress ? `${progress}%` : 'Downloading...'}
											</div>
										) : (
											<div className='flex items-center justify-center gap-2'>
												<DownloadIcon className='h-5 w-5' />
												Download
											</div>
										)}
									</Button>

									{progress !== null && <Progress value={progress} className='h-2.5 rounded-full bg-zinc-700 overflow-hidden' />}

									{message && (
										<div className='text-center text-sm px-4 py-2 bg-zinc-800/60 border border-zinc-700/40 rounded-xl text-white flex items-center justify-center gap-2 animate-bounce-in'>
											{message.includes('Downloaded:') ? (
												<>
													<CheckCircleIcon className='h-6 w-6 text-emerald-400' />
													<span className='text-emerald-400 overflow-hidden whitespace-nowrap text-ellipsis max-w-[80%]'>
														{message}
													</span>
												</>
											) : (
												<>
													<AlertCircleIcon className='h-6 w-6 text-yellow-400' />
													<span className='text-yellow-400 break-words max-w-[80%]'>{message}</span>
												</>
											)}
										</div>
									)}
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
