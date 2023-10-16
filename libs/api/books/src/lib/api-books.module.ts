import { HttpModule, Module } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { ReadingListController } from './reading-list.controller';
import { ReadingListService } from './reading-list.service';

@Module({
  imports: [HttpModule],
  controllers: [BooksController, ReadingListController],
  providers: [BooksService, ReadingListService],
  exports: [BooksService, ReadingListService],
})
export class ApiBooksModule {}