import { Injectable } from '@angular/core';
import { Http } from "@angular/http";
import 'rxjs/add/operator/map';

import { YoutubeSearchResults } from '../models/youtube-search-results.model';


@Injectable()
export class VideoService {

  constructor(private http: Http) {}

  fetchVideos(query: string) {
  	console.log("requesting",query)
    return this.http
      .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}`+
          '&maxResults=50' +
          '&type=video' +
          '&key=AIzaSyAARhzDEdAwaIYKelgTmVa8Nez5sLKjBcM')
      .map(response => {
        return new YoutubeSearchResults(response.json());
      })
  }
}