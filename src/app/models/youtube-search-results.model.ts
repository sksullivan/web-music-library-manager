import { YoutubeVideo } from './youtube-video.model';
import { YoutubeObject } from './youtube-object.model';


export class YoutubeSearchResults implements YoutubeObject {
	etag: string;
	items: [YoutubeVideo];
	nextPageToken: string;
	resultsPerPage: number;
	totalResults: number;

	constructor(jsonResults?: any) {
		if (jsonResults !== undefined) {
			this.etag = jsonResults.etag;
			this.items = jsonResults.items.map((jsonVideo?: any) => new YoutubeVideo(jsonVideo));
			this.nextPageToken = jsonResults.nextPageToken;
			this.resultsPerPage = jsonResults.pageInfo.resultsPerPage;
			this.totalResults = jsonResults.pageInfo.totalResults;
		} else {
			this.items = <[YoutubeVideo]>[];
		}
	}
}