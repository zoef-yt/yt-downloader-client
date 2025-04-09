'use client';

import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function SSETester() {
	const [progress, setProgress] = useState<number[]>([]);
	const [message, setMessage] = useState('');

	const startTest = () => {
		const newId = uuidv4();
		setProgress([]);
		setMessage('Connecting...');

		const source = new EventSource(`${process.env.NEXT_PUBLIC_BACKEND_ENDPOINT}/api/test-stream/${newId}`);

		source.onmessage = (event) => {
			const data = JSON.parse(event.data);
			if (data.progress !== undefined) {
				setProgress((prev) => [...prev, data.progress]);
				setMessage(`Progress: ${data.progress}%`);
			}
			if (data.status === 'done') {
				setMessage('Test completed!');
				source.close();
			}
		};

		source.onerror = (err) => {
			console.error('SSE error:', err);
			setMessage('Error occurred. Check console.');
			source.close();
		};
	};

	return (
		<div className='p-6 text-white'>
			<button onClick={startTest} className='px-6 py-2 bg-purple-600 rounded-md shadow hover:bg-purple-700'>
				Start SSE Test
			</button>

			<div className='mt-4'>
				{progress.map((p, i) => (
					<div key={i}>
						Ping {i + 1}: {p}%
					</div>
				))}
				<div className='mt-2 font-mono text-sm text-yellow-400'>{message}</div>
			</div>
		</div>
	);
}
