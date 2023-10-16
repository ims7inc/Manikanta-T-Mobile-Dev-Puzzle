import { Injectable } from '@nestjs/common';
import { StorageService } from '@tmo/shared/storage';
import { Book, ReadingListItem } from '@tmo/shared/models';

const STORAGE_KEY = '[okreads API] Reading List';

@Injectable()
export class ReadingListService {
  private readonly storageService = new StorageService<ReadingListItem[]>(STORAGE_KEY, []);

  async getList(): Promise<ReadingListItem[]> {
    return this.storageService.read();
  }

  async addBook(book: Book): Promise<void> {
    this.storageService.update((list) => {
      const { id, ...rest } = book;
      list.push({
        bookId: id,
        ...rest,
      });
      return list;
    });
  }

  async removeBook(bookId: string): Promise<void> {
    this.storageService.update((list) => list.filter(item => item.bookId !== bookId));
  }
}