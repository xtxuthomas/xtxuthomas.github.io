# Xiao-Tian Xu's website

This is your existing Hugo + PaperMod site, expanded without changing its theme. Edit content in Markdown and papers in YAML; no JavaScript or package installation is needed. Do not edit `themes/PaperMod/` for ordinary updates.

## Where to edit

| What you want to change | File |
| --- | --- |
| Homepage introduction and sections | `content/_index.md` |
| Name, subtitle, profile buttons, top navigation | `config.yml` |
| Publications and homepage selections | `data/publications.yaml` |
| Research overview | `content/research.md` |
| Teaching | `content/courses/_index.md` |
| Models and data links | `content/data/_index.md` |
| Useful links | `content/links.md` |
| Reading lists | `content/reading.md` |
| Education and research experience | `content/_index.md` (About me panel) |
| Photo, CV, research PDF, guitar video | `static/` |
| Small visual adjustments | `assets/css/extended/academic.css` |

The homepage uses `layouts/partials/index_profile.html` for the profile, then displays `content/_index.md`. The short `layouts/shortcodes/publications.html` template displays the same publication records on both the homepage and Papers page. Sections and ordinary pages use the existing theme layouts.

## Add a link

In any Markdown page, write:

```markdown
[Text visitors will see](https://example.org/)
```

For a list of links, put each on a line beginning with `- `:

```markdown
- [My collaborator](https://example.org/)
- [A useful paper](https://arxiv.org/abs/2503.23876)
```

Upload a PDF to `static/notes.pdf`, then link to it with `[Download notes](/notes.pdf)`. Do not include `static/` in the URL. Your site is hosted at the domain root, so `/research/` works from any page. Existing relative links also work with the local preview.

## Edit the homepage tabs

Edit the entries under `menu: main:` in `config.yml`. Each entry supplies a label, a homepage anchor such as `/#research`, and a weight. Lower weights appear first. This list controls both the homepage tabs and the menu on other pages.

Edit the panel text in `content/_index.md`. The section ID must match the anchor in `config.yml`. The Read lists panel links to the separate page in `content/reading.md`. The Useful links panel displays `content/links.md`.

## Add a figure or photo

1. Save your image as `static/images/my-figure.png` (create the `images` folder if needed). PNG is suitable for scientific plots; JPEG is suitable for photos. Use a short filename without spaces.
2. Open `content/_index.md` for the homepage, or `content/research.md` for the research page.
3. Paste this on its own line where the figure should appear, with a blank line before and after:

```text
{{< figure src="/images/my-figure.png" alt="Describe what the figure shows" caption="Figure 1. Your explanation of the result." >}}
```

Replace the filename, alt description, and caption with your own. `alt` describes the image for readers using a screen reader. The image fits the page width automatically and scales down on phones. The URL starts with `/images/`, not `/static/images/`.

To make a smaller figure, add `width="480"` inside the shortcode. To make the image clickable, add `link="/images/my-figure.png"`. For a plain image without a caption, Markdown also works:

```markdown
![Describe what the figure shows](/images/my-figure.png)
```

For a paper's own page, you can instead place `figure.png` beside `content/papers/my-paper/index.md` and use `src="figure.png"` in that page. To replace the existing hedgehog profile image, put a new photo in `static/` and update `imageUrl` under `profileMode` in `config.yml`.

Save the file and check the local preview. Do not add the figure shortcode until the matching image file exists, or the page will show a broken image.

## Add to the reading list

Edit `content/reading.md`. For each weekly update, add a block above the previous entries. Start with a divider and a heading with the actual update date and time, including the time zone.

```markdown
---

## YYYY-MM-DD · HH:MM (Shanghai time)

- [Paper title](https://arxiv.org/abs/ARXIV_ID): First Author, Second Author, Third Author, Fourth Author, Fifth Author
```

Keep one paper per line and list up to five authors in order. Use public arXiv links. The existing year headings serve as the archive for earlier entries.

## Add a paper (no separate page needed)

Add a record to `data/publications.yaml`. Copy a neighbouring record, keep the indentation, and replace its values. Put it where it should appear: the list follows file order.

```yaml
- title: "Your paper title"
  authors: "Xiao-Tian Xu, Collaborator, et al."
  year: 2026
  group: "lead"
  selected: true
  links:
    - label: "arXiv"
      url: "https://arxiv.org/abs/YOUR_ID"
    - label: "PDF"
      url: "https://arxiv.org/pdf/YOUR_ID"
    - label: "Journal"
      url: "https://doi.org/YOUR_DOI"
    - label: "Code"
      url: "https://github.com/YOUR_ACCOUNT/YOUR_REPOSITORY"
```

Replace the example URLs before publishing; omit links that do not exist. You can add any number of links, such as Data, Slides, or Supplement.

- `group`: use `lead`, `collaboration`, or `preprint`, matching the three sections in `content/papers/_index.md`.
- `selected: true`: also shows the paper on the homepage. Use `false` for all other papers.
- Keep titles and authors in quotes, especially if they contain a colon. Use spaces, never tabs, for indentation.
- The selected paper appears automatically; do not duplicate it in the homepage file.

The current bibliography is transcribed from `static/XXU_Works_v2.pdf`, uploaded in December 2025. Update paper details and the source-date sentence in `content/papers/_index.md` when you refresh the bibliography. It does not automatically synchronize with arXiv, ADS, or ORCID.

## Make another page

1. Create `content/notes.md` with:

```markdown
---
title: "Notes"
description: "My astronomy notes and resources."
hideMeta: true
---

## Stellar evolution

A short introduction to my notes.

- [Download notes](/notes.pdf)
```

2. Put the corresponding `notes.pdf` in `static/` before using that example link.
3. The new page is available at `/notes/`.
4. Link to it from the relevant homepage panel using `[Notes](notes/)`. To make it a homepage tab, add a panel in `content/_index.md` and a matching anchor under `menu: main:`.

Alternatively, run `hugo new content notes.md`. The supplied archetype creates a draft: remove `draft: true` or set it to `false` when ready. Drafts are excluded from the normal site.

## Give a paper its own page

Create a folder `content/papers/my-paper/` with `index.md` and optionally `paper.pdf` and figures. Start with:

```markdown
---
title: "My paper title"
description: "A one-sentence summary of the result."
hideMeta: true
---

## Abstract

Your abstract here.

## Downloads

[Paper PDF](paper.pdf)

## Citation

Your citation here.
```

Only use the PDF link if you added that file. The page lives at `/papers/my-paper/`. Add a link labelled `Details` to the relevant publication record with `url: "/papers/my-paper/"`. Hugo also lists the detail page below the bibliography on the Papers page. You can start the file using `hugo new content --kind paper papers/my-paper/index.md`; remove its draft flag once ready.

## Preview and build

Use Hugo **0.147.2 extended**, matching `.github/workflows/hugo.yml`. See [Hugo installation](https://gohugo.io/installation/) for other machines.

From this `website` directory:

```powershell
hugo server
```

Open http://localhost:1313/. Edits reload automatically. Ctrl+C stops the server. For this workspace, a local Hugo executable was downloaded next to the repository, so you can use:

```powershell
../.tools/hugo/hugo.exe server
```

Build the production site with `hugo --minify` (or `../.tools/hugo/hugo.exe --minify`). The output is in `public/`; it is generated and should not be edited or committed. Run `node scripts/check-site.mjs` after a build to check local links, images, page titles, and leftover demo text. To preview drafts intentionally, use `hugo server -D`; never use `-D` for the production build.

## Publish to your existing GitHub Pages site

Changes made here are local until pushed. Open this `website` folder in GitHub Desktop, review the changed files, commit, and push to `main` in `xtxuthomas/xtxuthomas.github.io`. The existing GitHub Actions workflow builds and deploys automatically. Watch the repository's Actions tab for a successful deployment, then visit https://xtxuthomas.github.io/.

Do not upload `public/`, `.tools/`, or the outer workspace. This `website` folder is the actual cloned repository. The original example papers, courses, book, office-hours, and location pages are retained as drafts for reference. They are not your publications or teaching materials.

## Credits

Built on [Pascal Michaillat's academic Hugo template](https://github.com/pmichaillat/hugo-website) and [PaperMod](https://github.com/adityatelange/hugo-PaperMod/). Organization draws on the academic homepages of [Dong Lai](https://donglai6.github.io/) and [Wenbin Lu](https://wenbinlu.github.io/). The original MIT license is retained in `LICENSE.md`.
