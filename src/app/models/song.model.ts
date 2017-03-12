export class Song {
	private etag: string;
	private videoId: string;
	private title: string;

	constructor(etag: string, videoId: string, title: string) {
		this.etag = etag;
		this.videoId = videoId;
		this.title = title;
	}
}