export async function downloadVideo({
	ytUrl,
	type,
	extension,
	id,
	onProgress,
	messageSetter,
}: {
	ytUrl: string;
	type: string;
	extension: string;
	id: string;
	onProgress: (progress: number) => void;
	messageSetter: (message: string) => void;
}): Promise<string> {
	const backend = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT;
	const sseEndpoint = process.env.NEXT_PUBLIC_SSE_ENDPOINT;
	const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
	const sse = new EventSource(`${backend}/${sseEndpoint}/${id}`);
	return new Promise(async (resolve, reject) => {
		sse.onmessage = (event) => {
			const data = JSON.parse(event.data);
			console.log('SSE message:', data);
			if (onProgress) onProgress(data.progress);
			if (data.status === 'processing') {
				messageSetter('Finalizing download...');
			} else if (data.status === 'sending file') {
				messageSetter('Sending file to browser...');
			}
		};

		sse.onerror = () => {
			sse.close();
		};

		try {
			const res = await fetch(`${backend}/${apiEndpoint}`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ url: ytUrl, type, format: extension, id }),
			});

			if (!res.ok) {
				const errorRes = await res.json();
				throw new Error(errorRes.error || 'Download failed');
			}

			const contentDisposition = res.headers.get('Content-Disposition');
			let filename = `download.${extension}`;
			if (contentDisposition) {
				const match = contentDisposition.match(/filename="(.+)"/);
				if (match?.[1]) filename = match[1];
			}

			const blob = await res.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			window.URL.revokeObjectURL(url);
			sse.close();
			resolve(filename);
		} catch (err) {
			console.error('Download error:', err);
			sse.close();
			reject(err);
		}
	});
}

export async function checkHealth() {
	console.log('Checking backend health...');
	console.log('Backend endpoint:', process.env.NEXT_PUBLIC_BACKEND_ENDPOINT);
	try {
		const res = await fetch(`http://192.168.0.104:4444/api/health`);
		const data = await res.json();
		if (data.status === 'ok') {
			console.log('✅ Backend is alive:', data);
		} else {
			console.warn('⚠️ Backend returned something unexpected:', data);
		}
	} catch (err) {
		console.error('❌ Backend is unreachable:', err);
	}
}
