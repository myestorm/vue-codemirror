import MarkdownIt from 'markdown-it'
import sourcemap from './sourcemap'
import tasklists from './tasklists'
import { html5Media } from './media'

const markdownItConfig: MarkdownIt.Options = {
  html: true,
  xhtmlOut: false,
  breaks: false, 
  langPrefix: 'language-',
  linkify: false,  
  typographer: false,
  quotes: '“”‘’'
}
const _markdownIt = new MarkdownIt(markdownItConfig)
_markdownIt.use(tasklists)
_markdownIt.use(html5Media)
_markdownIt.use(sourcemap)

export const markdownIt = _markdownIt

export default (md: string): string => {
  const html = _markdownIt.render(md)
  return html
}
