import { YoutubeVideo } from './youtube-video.model';


export class YoutubeSearchResults {
	etag: string;
	items: [YoutubeVideo];
	nextPageToken: string;
	resultsPerPage: number;
	totalResults: number;

	constructor(jsonObject: any) {
		console.log(jsonObject)
		if (jsonObject) {
			this.etag = jsonObject.etag;
			this.items = jsonObject.items;
			this.nextPageToken = jsonObject.nextPageToken;
			this.resultsPerPage = jsonObject.pageInfo.resultsPerPage;
			this.totalResults = jsonObject.pageInfo.totalResults;
		} else {
			this.items = <[YoutubeVideo]>[];
		}
	}
}