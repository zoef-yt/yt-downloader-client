import { z } from 'zod';
import { DOWNLOAD_OPTIONS } from './constants';

const typeEnum = z.enum(Object.keys(DOWNLOAD_OPTIONS) as [string, ...string[]]);

export const formSchema = z.object({
	ytUrl: z
		.string()
		.regex(/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/|shorts\/)|youtu\.be\/)[\w-]{11}(\?.*)?$/, 'Enter a valid YouTube URL'),
	type: typeEnum,
	extension: z.string().nonempty('Select a file extension'),
});
