import { HttpService, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Book } from '@tmo/shared/models';

@Injectable()
export class BooksService {
  constructor(private readonly httpService: HttpService) {}

  search(searchTerm: string): Observable<Book[]> {
    if (!searchTerm) {
      throw new Error('Missing search term');
    }

    return this.httpService
      .get(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}`)
      .pipe(
        map((response) => {
          return response.data.items.map((item) => ({
            id: item.id,
            title: item.volumeInfo?.title,
            authors: item.volumeInfo?.authors || [],
            description: item.searchInfo?.textSnippet,
            publisher: item.volumeInfo?.publisher,
            publishedDate: item.volumeInfo?.publishedDate
              ? new Date(item.volumeInfo?.publishedDate).toISOString()
              : undefined,
            coverUrl: item.volumeInfo?.imageLinks?.thumbnail,
          }));
        })
      );
  }
}