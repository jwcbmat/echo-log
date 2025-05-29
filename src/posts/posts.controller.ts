import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PostsService } from './posts.service';
import { marked } from 'marked';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Get()
  getList() {
    return this.postsService.listPosts();
  }

  @Get(':slug')
  getPost(@Param('slug') slug: string, @Res() res: Response) {
    const md = this.postsService.getMarkdown(slug);
    const html = marked(md);

    const parts = slug.split('-');
    const dateStr = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const date = new Date(dateStr).toLocaleDateString('pt-BR');
    const title = parts.slice(3).join(' ').replace(/-/g, ' ');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${title}</title>
        <link rel="stylesheet" href="/style.css" />
        <style>
          body {
            background-color: #121212;
            color: #e0e0e0;
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 2rem 1.5rem;
            display: flex;
            justify-content: center;
            min-height: 100vh;
          }
          .post-wrapper {
            max-width: 720px;
            width: 100%;
            box-sizing: border-box;
            padding: 0 1rem;
          }
          a.back-link {
            color: #90caf9;
            text-decoration: none;
            font-weight: 600;
            margin-bottom: 2rem;
            display: inline-block;
            user-select: none;
            transition: color 0.3s ease;
          }
          a.back-link:hover,
          a.back-link:focus {
            color: #bbdefb;
            text-decoration: underline;
            outline: none;
            cursor: pointer;
          }
          .post-header {
            margin-bottom: 2rem;
            padding: 0 0.25rem;
          }
          .post-date {
            color: #888;
            font-size: 0.9rem;
            display: block;
            margin-bottom: 0.25rem;
            font-weight: 500;
            letter-spacing: 0.03em;
          }
          .post-title {
            font-size: 2.5rem;
            font-weight: 700;
            margin: 16px;
            color: #e0e0e0;
            line-height: 1.1;
          }
          .post-content {
            color: #ddd;
            padding: 0 0.25rem;
            font-size: 1rem;
            line-height: 1.6;
          }
          .post-content h2, 
          .post-content h3, 
          .post-content h4 {
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: #90caf9;
            font-weight: 600;
          }
          .post-content a {
            color: #90caf9;
            text-decoration: underline;
            transition: color 0.3s ease;
          }
          .post-content a:hover,
          .post-content a:focus {
            color: #bbdefb;
            outline: none;
          }
        </style>
      </head>
      <body>
        <div class="post-wrapper">
          <a href="/" class="back-link">← back</a>
          <header class="post-header">
            <time datetime="${dateStr}" class="post-date">${date}</time>
            <h1 class="post-title">${title}</h1>
          </header>
          <article class="post-content">${html}</article>
        </div>
      </body>
      </html>
    `);
  }
}
