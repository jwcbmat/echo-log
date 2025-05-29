import { Injectable } from '@nestjs/common';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

console.log(join(process.cwd(), 'posts'))
@Injectable()
export class PostsService {
  private postsDir = join(process.cwd(), 'posts');

  listPosts() {
    return readdirSync(this.postsDir)
      .filter(file => file.endsWith('.md'))
      .map(file => {
        const parts = file.replace('.md', '').split('-');
        const slug = file.replace('.md', '');
        return {
          slug,
          date: `${parts[0]}-${parts[1]}-${parts[2]}`,
          title: parts.slice(3).join(' ').replace(/-/g, ' '),
        };
      });
  }

  getMarkdown(slug: string): string {
    return readFileSync(join(this.postsDir, `${slug}.md`), 'utf8');
  }
}
