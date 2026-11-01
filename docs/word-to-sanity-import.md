# GlowSkin: Word (.docx) → Sanity article draft

## Where to find it

After PR #27 is reviewed, tested, and **merged by the site owner**, sign in to [Sanity Studio](https://glowskin.blog/studio) and choose **Import from Word** in the Studio tool navigation (path: `/studio/word-import`).

This feature never automatically publishes an article or edits existing articles.

## Recommended Word structure

Use **Microsoft Word Heading 1 / Heading 2 / Heading 3** styles; don't merely enlarge normal text. Put the metadata labels at the beginning of the document, each on a separate paragraph:

```text
Title: Nighttime Skincare Routine for Beginners
Category: Routine Building
SEO Title: Nighttime Skincare Routine: Steps & Order
Meta Description: Learn the order of a simple nighttime skincare routine and how to adjust it for your skin.
Excerpt: A beginner-friendly guide to evening skincare.
Direct Answer: Begin by cleansing, then apply suitable treatments, followed by moisturizer.
Cover Image Alt: Evening skincare products arranged on a shelf
Author: [NEEDS INPUT: real author name]
Author Bio: [NEEDS INPUT: verified experience]
Reviewer: [ONLY IF A QUALIFIED PERSON ACTUALLY REVIEWED IT]
Published Date: [OPTIONAL: ISO date or datetime]
```

Insert your **actual cover image** near the beginning of the Word document. Use Word's **Insert → Pictures** and choose an embedded JPG, PNG or WebP, rather than pasting a link to an online image. The first supported embedded image is automatically selected as the cover; you can change this during review.

After the metadata and cover, write the article normally. Include real reference URLs instead of claims without sources.

```text
[Heading 1] Nighttime Skincare Routine for Beginners
[Heading 2] Step 1: Cleanse
Paragraphs, bold/italic, external hyperlinks, lists, tables, inline images.
[Heading 2] Frequently Asked Questions
Q: Do I need a ten-step routine?
A: No. Start with a simple routine appropriate for your skin.
[Heading 2] Sources
American Academy of Dermatology — https://www.aad.org/...
```

## How to import

1. Upload one valid **.docx** file (not legacy `.doc`), **under 25 MB**. Use a current Chrome, Edge, Firefox or Safari browser.
2. Review the extracted title, slug, category, excerpt, SEO title/description, and direct answer.
3. Check the cover-image radio selection, embedded images and their **alt text**, the article outline, tables, FAQ answers, and real reference URLs.
4. Confirm that the author/reviewer identity was supplied and verified. Do not invent credentials or clinical reviews.
5. Click **Create unpublished Sanity draft**.
6. Click **Open article draft in Studio**. Compare the complete article to the Word original before publishing.
7. If an article already has the same slug, edit it through the regular Studio instead. This importer intentionally refuses to overwrite.

The public article will appear only after someone manually publishes the draft in Studio. Existing URLs are not modified.

## SEO and accessibility checks before publish

- One descriptive article title and unique slug; do not change an established indexed slug unnecessarily.
- SEO title and meta description genuinely describe the page and aren't stuffed with keywords.
- First paragraph/direct answer is a genuine, verifiable answer.
- Cover and other useful images have meaningful alt text, not generic keyword strings.
- Heading outline is logical; tables are checked at mobile width.
- FAQ answers are factually correct, with no fabricated claims.
- Scientific/health facts link to reliable primary or dermatology sources.
- Author/reviewer names and dates are accurate and actually associated with the article.
- Preview the final article on both desktop and mobile before publishing.

## Current limitations

- Only modern .docx files and embedded PNG/JPG/WebP/GIF imagery are handled.
- Basic Word headings, hyperlinks, rich inline text, lists, tables and images are supported. Exact layout, text wrapping, floating objects, tracked edits, SmartArt, footnotes, complex merged table cells, and formulas may need manual cleanup.
- The importer does not automatically fact-check medical claims, citations or metadata; it only transfers what you included.
- Empty SEO fields remain editable and are flagged; the importer will not invent facts, credentials or URLs.
- Image assets can remain in the Sanity media library if an interrupted upload is retried.
- A browser-based test with a representative .docx is required before merging PR #27.
