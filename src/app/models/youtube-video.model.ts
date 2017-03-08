import { YoutubeObject } from './youtube-object.model';


export class YoutubeVideo implements YoutubeObject {
	etag: string;
	title: string;
	thumbnail: string;
	publishDate: Date;

	constructor(jsonVideo?: any) {
		if (jsonVideo !== undefined) {
			this.etag = jsonVideo.etag;
			this.title = jsonVideo.snippet.title;
			this.thumbnail = jsonVideo.snippet.thumbnails.default.url;
			this.publishDate = new Date(jsonVideo.snippet.publishedAt);
		}
	}
}