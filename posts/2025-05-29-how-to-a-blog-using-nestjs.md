
# How to Build a Blog Using NestJS

It might sound unconventional—especially in a world where React courses go for R$2.000,00 —but building a blog with **NestJS** has its own charm!

The goal here isn't to reinvent the wheel, but to understand how a backend can render content and serve it using Markdown and HTML.

We’ll also get a practical look into **Server-Side Rendering (SSR)**, even without a frontend framework.

---

##  What is SSR (Server-Side Rendering)?

**SSR** means pages are rendered on the server before being sent to the browser. That means the HTML arrives fully built—unlike **CSR (Client-Side Rendering)**, where the browser receives JavaScript and assembles the page.

### In this blog, we’ll use NestJS to:

- Read Markdown files on the backend.
-  Convert them into HTML.
-  Serve the HTML via API or a simple route.

---

##  Why is this useful?

Here are some reasons:

-  **SEO-friendly** — content is ready for search engines to crawl.
-  Faster initial load time.
-  Works even if JavaScript is disabled.

> 🧠 When a search engine (like Google) visits your site, it tries to **read and understand the content**. This process is called **indexing**. The clearer your HTML, the better it can rank.

---

##  Setting Up the Blog

### 1. Create your NestJS project

```bash
nest new blog
```

---

### 2. Serve Static Files

Install the module:

```bash
npm install --save @nestjs/serve-static
```

Then configure it in `app.module.ts`:

```ts
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
  ],
})
export class AppModule {}
```

Create a `client/index.html` with your base HTML.

---

##  Your `index.html`

```html
<ul id="post-list"></ul>

<script>
  fetch('/posts')
    .then(res => res.json())
    .then(posts => {
      const list = document.getElementById('post-list');
      posts.forEach(({ date, slug, title }) => {
        const li = document.createElement('li');
        li.classList.add('post-item');
        li.innerHTML = `<a href="/posts/${slug}">${title}</a>`;
        list.appendChild(li);
      });
    });
</script>
```

> 🔍 You can move the script to a separate `.js` file inside the public folder if preferred.

---

## Create the Posts Module

```bash
nest g module posts
nest g controller posts
nest g service posts
```

### Structure Recap

- The **controller** defines the HTTP routes.
- The **service** handles logic (file reading, markdown conversion).
- The **module** binds everything together.

> 🧠 Nest uses **dependency injection**. If you don’t register a controller/service in the module, it won’t be available.

---

##  Install `marked`

We’ll use [marked](https://www.npmjs.com/package/marked) to convert Markdown to HTML.

```bash
npm install marked
```

---

##  Controller Example (`posts.controller.ts`)

```ts
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { PostsService } from './posts.service';
import { marked } from 'marked';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  getList() {
    return this.postsService.listPosts(); // Returns array of { slug, title, date }
  }

  @Get(':slug')
  getPost(@Param('slug') slug: string, @Res() res: Response) {
    const markdown = this.postsService.getMarkdown(slug);
    const html = marked(markdown);

    const parts = slug.split('-');
    const dateStr = `${parts[0]}-${parts[1]}-${parts[2]}`;
    const date = new Date(dateStr).toLocaleDateString();
    const title = parts.slice(3).join(' ').replace(/-/g, ' ');

    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
        </head>
        <body>
          <article>
            <h1>${title}</h1>
            <small>${date}</small>
            <div>${html}</div>
          </article>
          <a href="/">← Back</a>
        </body>
      </html>
    `);
  }
}
```

>  You can also load an HTML template from a file using `fs.readFileSync` if you want a prettier UI.

