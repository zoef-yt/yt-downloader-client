import { downloadOptionType } from './type';

export const DOWNLOAD_OPTIONS: downloadOptionType = {
	both: {
		label: 'Audio & Video',
		extensions: ['mp4'],
	},
	videoonly: {
		label: 'Video Only',
		extensions: ['mp4'],
	},
	audioonly: {
		label: 'Audio Only',
		extensions: ['mp3'],
	},
};

export const FORM_DEFAULT_VALUES = {
	ytUrl: '',
	type: 'both',
	extension: 'mp4',
};
