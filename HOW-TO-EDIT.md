# How to edit your website without code

Your site is now split into three kinds of things:

- **Your words, links and details** live in the `content` folder (one small file per section).
- **Your pictures** live in `assets/images`.
- **The design** lives in `styles.css`, `site.js` and `index.html`. You never need to open these to change what the site says.

You change the first two through **Pages CMS**, an open-source editor that shows forms instead of code. When you press **Save**, it updates the files in GitHub, and your website refreshes by itself within a minute or two.

---

## One-time setup (about 30 minutes, easiest on a computer)

### 1. Put the site on GitHub
1. Make a free account at **github.com** (skip if you have one).
2. Click **+ → New repository**. Name it `zay-site` (any name works), keep it **Public**, click **Create repository**.
3. On the new repository page click **uploading an existing file**.
4. Unzip the folder you were given. Open it and drag **everything inside it** into the GitHub page: `index.html`, `styles.css`, `site.js`, `HOW-TO-EDIT.md`, and the folders `content` and `assets`.
5. **Do not forget `.pages.yml`.** It is a hidden file, so you may not see it.
   - Mac: in the folder, press **Cmd + Shift + .** (full stop) to reveal hidden files.
   - Windows: in File Explorer, **View → Show → Hidden items**.

   Without it, Pages CMS will not show your forms.
6. Scroll down and click **Commit changes**.

### 2. Turn the site on
1. In the repository click **Settings → Pages**.
2. Under **Build and deployment**, set **Source: Deploy from a branch**, **Branch: main**, **Folder: / (root)**, then **Save**.
3. Wait a minute or two. The page then shows your website address (it looks like `yourname.github.io/zay-site`).

If your site already lives on another host (Netlify, Vercel, Cloudflare Pages, a custom domain), connect that host to this same repository instead. The files work the same on any of them.

### 3. Connect the editor
1. Go to **app.pagescms.org** and choose **Sign in with GitHub**.
2. When asked, **install the GitHub App** on your account and allow it to see the `zay-site` repository.
3. Open the repository. On the left you will see your sections: Home, About, Writing & Reflections, Photography, and so on.

You are done. From now on you only need step 3.

---

## Everyday edits

Open **app.pagescms.org**, pick the repository, pick a section, change things, press **Save**.

| I want to... | Go to | Do this |
|---|---|---|
| Add an essay | Writing & Reflections | Under *Essays and reflections* click **Add an entry**. Fill in title, date and full text. Leave a blank line between paragraphs. |
| Put a new essay first | Writing & Reflections | Drag the entry to the top of the list. |
| Add a photo | Photography | Open a collection, click **Add an entry** under *Photos*, then upload the picture, write its title and a one-line description. |
| Start a new collection | Photography | Under *Collections* click **Add an entry**. Numbers (01, 02, 03...) update by themselves. |
| Add a video | Video | **Add an entry**, paste the link, upload a thumbnail. |
| Add a publication | Books & Publications | **Add an entry**. The cover and link are optional. |
| Add a kind note | Notes from Others | **Add an entry**. Only use a name with the writer's permission. |
| Change where enquiries go | Zay & Form | Edit *Email that enquiries go to*. |
| Add or change a social link | Contact | Edit the list under *Other links*. |
| Swap your top photo or portrait | Home or About | Click the picture field and upload a new one. |

### Small things worth knowing
- **Italics:** put stars around words, like `*Lunaris Review*`, in descriptions and essays.
- **Poems:** a single line break inside a paragraph is kept, so poem lines stay as you type them.
- **Picture descriptions (alt text):** every picture asks for a one-sentence description. It helps people who use screen readers and shows if a picture fails to load.
- **Picture size:** JPG is best. Try to keep each picture under about 1.5 MB so the page stays quick.
- **After saving:** the live site can take 1 to 2 minutes to update. If you do not see your change, refresh the page.
- **Mistakes:** GitHub keeps every earlier version. Nothing is ever truly lost, and I can help you go back.
- **Links to other sites** should start with `https://`. (The Lunaris link only works with `http://`, so it stays as it is.)

---

## What still needs a code change

The forms cover everything you read on the site. These few things are still in the code, so ask for help if you want them changed:

- The **menu names** at the top, and the browser-tab **page title and description** (both are in `index.html`).
- Adding a **brand new section** (for example a "Shop" section) or removing one.
- Changing **colours, fonts or layout**.

## Preview note

Do not double-click `index.html` to preview it. Browsers block a page from reading its own content files that way, and you will see a message saying so. View it through your live website address instead.
