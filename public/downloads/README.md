# Downloads

Drop downloadable files here (textbooks, slide decks, short video clips), then
register each one in `lib/downloads.ts` so it appears in the Downloads section
on `/resources`.

Example:

1. Add the file: `public/downloads/aws-well-architected.pdf`
2. Add an entry in `lib/downloads.ts`:

   ```ts
   {
     title: "AWS Well-Architected, in plain English",
     kind: "textbook",            // "textbook" | "slides" | "clip"
     file: "/downloads/aws-well-architected.pdf",
     size: "2.4 MB",              // optional
   }
   ```

Files are served from the site root, so `public/downloads/x.pdf` is available at
`/downloads/x.pdf`. Any file type works; the browser downloads it via the
download button.
