import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Book } from '@tmo/shared/models';
import { ReadingListService } from './reading-list.service';

@Controller()
export class ReadingListController {
  constructor(private readonly readingListService: ReadingListService) {}

  @Get('/reading-list/')
  async getReadingList(): Promise<any> {
    return await this.readingListService.getList();
  }

  @Post('/reading-list/')
  async addToReadingList(@Body() book: Book): Promise<any> {
    return await this.readingListService.addBook(book);
  }

  @Delete('/reading-list/:id')
  async removeFromReadingList(@Param('id') bookId: string): Promise<any> {
    return await this.readingListService.removeBook(bookId);
  }
}