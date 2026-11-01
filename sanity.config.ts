import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { apiVersion, dataset } from './sanity/env'
import { schema } from './sanity/schemaTypes'
import { replyAction } from './sanity/actions/replyAction'
import WordArticleImporter from './sanity/word-import/WordArticleImporter'

export default defineConfig({
  basePath: '/studio',
  projectId: '3x2g2pvc',
  dataset,
  schema,
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Content')
              .child(
                S.list()
                  .title('Content')
                  .items([
                    // Make Word upload discoverable where authors manage articles.
                    // The standalone /studio/word-import tool stays available too.
                    S.listItem()
                      .id('import-word-article')
                      .title('Import Article from Word (.docx)')
                      .child(
                        S.component(WordArticleImporter)
                          .id('word-article-import-pane')
                          .title('Import Article from Word')
                      ),
                    S.documentTypeListItem('article').title('Articles'),
                    S.documentTypeListItem('product').title('Products'),
                    S.documentTypeListItem('ingredient').title('Ingredients'),
                    S.documentTypeListItem('concern').title('Concerns'),
                  ])
              ),
            S.divider(),
            S.listItem()
              .title('Messages')
              .child(
                S.documentTypeList('message').title('Messages')
              ),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  tools: [{ name: 'word-import', title: 'Import from Word', component: WordArticleImporter }],
  document: {
    actions: (prev, context) => {
      if (context.schemaType === 'message') {
        return [...prev, replyAction]
      }
      return prev
    },
  },
})