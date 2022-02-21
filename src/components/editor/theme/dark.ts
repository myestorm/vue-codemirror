import {EditorView} from "@codemirror/view"
import {Extension} from "@codemirror/state"
import {HighlightStyle, tags as t} from "@codemirror/highlight"

const chalky = "#e5c07b",
  coral = "#e06c75",
  cyan = "#56b6c2",
  invalid = "#ffffff",
  ivory = '#d4d4d4',
  stone = "#999999", // Brightened compared to original to increase contrast
  malibu = "#61afef",
  sage = "#98c379",
  whiskey = "#d19a66",
  violet = "#c678dd",
  darkBackground = "#21252b",
  highlightBackground = "#090909",
  background = "#17171a",
  tooltipBackground = "#17171a",
  selection = "#0b4b73",
  cursor = "#888",
  fontFamily = 'Menlo, "Ubuntu Mono", Consolas, "Courier New", "Microsoft Yahei", "Hiragino Sans GB", "WenQuanYi Micro Hei", sans-serif',
  fontSize = '14px',
  iconColor = '%23999'

  const arrowDown = `"data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath d='M512 714.667c-8.533 0-17.067-2.134-23.467-8.534L147.2 364.8c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.867 317.867-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333 704c-4.266 8.533-12.8 10.667-21.333 10.667z' fill='${iconColor}'/%3E%3C/svg%3E"`
  
  const arrowRight = `"data:image/svg+xml,%3Csvg class='icon' viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath d='M320 885.333c-8.533 0-17.067-4.266-23.467-10.666-12.8-12.8-10.666-34.134 2.134-44.8L654.933 512 298.667 194.133c-12.8-10.666-14.934-32-2.134-44.8 10.667-12.8 32-14.933 44.8-2.133l384 341.333c6.4 6.4 10.667 14.934 10.667 23.467s-4.267 17.067-10.667 23.467l-384 341.333c-6.4 6.4-12.8 8.533-21.333 8.533z' fill='${iconColor}'/%3E%3C/svg%3E"`

export const totonooDarkTheme = EditorView.theme({
  "&": {
    color: ivory,
    backgroundColor: background,
    height: '100%'
  },

  ".cm-content": {
    caretColor: cursor,
    fontFamily,
    fontSize
  },

  '.cm-cursor, .cm-dropCursor': { borderLeftColor: cursor, borderWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: selection },

  '.cm-panels': { backgroundColor: darkBackground, color: ivory },
  '.cm-panels.cm-panels-top': { borderBottom: '1px solid #eeeeee' },
  '.cm-panels.cm-panels-bottom': { borderTop: '1px solid #eeeeee' },

  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: "1px solid #457dff"
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: "#6199ff2f"
  },

  ".cm-activeLine": { backgroundColor: highlightBackground },
  ".cm-selectionMatch": {backgroundColor: "#aafe661a"},

  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    backgroundColor: "#bad0f847",
    outline: "1px solid #515a6b"
  },

  ".cm-gutters": {
    backgroundColor: background,
    color: stone,
    border: "none",
    fontFamily,
    fontSize
  },

  ".cm-activeLineGutter": {
    backgroundColor: highlightBackground
  },

  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },

  ".cm-tooltip": {
    border: "none",
    backgroundColor: tooltipBackground
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: tooltipBackground,
    borderBottomColor: tooltipBackground
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: highlightBackground,
      color: ivory
    }
  },

  // icons
  '.cm-gutters .editor-unfold, .cm-gutters .editor-fold': {
    width: '10px',
    height: '10px',
    display: 'inline-block',
    backgroundImage: 'url(' + arrowDown + ')',
    backgroundSize: '100% 100%',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
    margin: '4px 0 0'   
  },

  '.cm-gutters .editor-fold': {
    backgroundImage: 'url(' + arrowRight + ')'   
  }
}, { dark: true })

export const totonooDarkHighlightStyle = HighlightStyle.define([
  {tag: t.keyword,
   color: violet},
  {tag: [t.name, t.deleted, t.character, t.propertyName, t.macroName],
   color: coral},
  {tag: [t.function(t.variableName), t.labelName],
   color: malibu},
  {tag: [t.color, t.constant(t.name), t.standard(t.name)],
   color: whiskey},
  {tag: [t.definition(t.name), t.separator],
   color: ivory},
  {tag: [t.typeName, t.className, t.number, t.changed, t.annotation, t.modifier, t.self, t.namespace],
   color: chalky},
  {tag: [t.operator, t.operatorKeyword, t.url, t.escape, t.regexp, t.link, t.special(t.string)],
   color: cyan},
  {tag: [t.meta, t.comment],
   color: stone},
  {tag: t.strong,
   fontWeight: "bold"},
  {tag: t.emphasis,
   fontStyle: "italic"},
  {tag: t.strikethrough,
   textDecoration: "line-through"},
  {tag: t.link,
   color: stone,
   textDecoration: "underline"},
  {tag: t.heading,
   fontWeight: "bold",
   color: coral},
  {tag: [t.atom, t.bool, t.special(t.variableName)],
   color: whiskey },
  {tag: [t.processingInstruction, t.string, t.inserted],
   color: sage},
  {tag: t.invalid,
   color: invalid},
])

export const Dark: Extension = [totonooDarkTheme, totonooDarkHighlightStyle]
