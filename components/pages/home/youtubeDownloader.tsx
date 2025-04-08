'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
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

export function YoutubeDownloader() {
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
			console.error('Download error:', error);
			setMessage(error instanceof Error ? error.message : 'Download fa.');
		} finally {
			setProgress(null);
			setIsLoading(false);
		}
	};

	return (
		<div className='flex items-center justify-center'>
			<Card className='w-full max-w-2xl rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl text-white'>
				<CardContent className='p-4 sm:p-8'>
					<h2 className='text-3xl sm:text-4xl font-semibold text-center mb-8 text-white tracking-tight'>YouTube Downloader</h2>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
							<FormField
								control={form.control}
								name='ytUrl'
								render={({ field }) => (
									<FormItem>
										<FormLabel className='text-sm font-medium text-zinc-300'>Video URL</FormLabel>
										<FormControl>
											<Input
												{...field}
												placeholder='https://youtube.com/watch?v=...'
												className='h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white placeholder:text-zinc-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className='flex flex-row gap-4'>
								<FormField
									control={form.control}
									name='type'
									render={({ field }) => (
										<FormItem className='flex-1'>
											<FormLabel className='text-sm font-medium text-zinc-300'>Format</FormLabel>
											<Select
												value={field.value}
												onValueChange={(val) => {
													form.setValue('extension', DOWNLOAD_OPTIONS[val].extensions[0]);
													field.onChange(val);
												}}
											>
												<FormControl>
													<SelectTrigger className='h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer'>
														<SelectValue />
													</SelectTrigger>
												</FormControl>
												<SelectContent className='bg-zinc-900 border-zinc-700 text-white rounded-xl shadow-lg'>
													{Object.entries(DOWNLOAD_OPTIONS).map(([key, value]) => (
														<SelectItem key={key} value={key} className='hover:bg-zinc-800 cursor-pointer'>
															{value.label}
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
											<FormItem className='flex-1 '>
												<FormLabel className='text-sm font-medium text-zinc-300'>Extension</FormLabel>
												<Select value={field.value} onValueChange={field.onChange}>
													<FormControl>
														<SelectTrigger className='h-12 rounded-xl bg-zinc-800 border border-zinc-700 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 cursor-pointer'>
															<SelectValue placeholder='Select extension' />
														</SelectTrigger>
													</FormControl>
													<SelectContent className='bg-zinc-900 border-zinc-700 text-white rounded-xl shadow-lg'>
														{DOWNLOAD_OPTIONS[selectedType].extensions.map((ext) => (
															<SelectItem key={ext} value={ext} className='hover:bg-zinc-800 cursor-pointer'>
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
							<div ref={anim} className='space-y-3'>
								<Button
									type='submit'
									disabled={isLoading}
									className='w-full h-12 rounded-xl text-lg font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 cursor-pointer'
								>
									{isLoading ? (
										<div className='flex items-center justify-center'>
											<Loader2 className='animate-spin h-5 w-5' />
											{progress ? <p>{progress}%</p> : null}
										</div>
									) : (
										'Download'
									)}
								</Button>
								{progress !== null && <Progress value={progress} className='h-2 bg-zinc-800 rounded-full' />}
								{message && <p className='text-center text-sm text-zinc-400 break-words px-6'>{message}</p>}
							</div>
						</form>
					</Form>
				</CardContent>
			</Card>
			{/* <Button
				className='w-full h-12 rounded-xl text-lg font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-all duration-200 cursor-pointer'
				onClick={checkHealth}
			>
				Chekc Health
			</Button> */}
		</div>
	);
}
