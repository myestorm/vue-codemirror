import { FunctionalComponent, SVGAttributes } from 'vue'
import parserMarkdown from 'prettier/parser-markdown'
import MarkdownEditor from './index'
import { ThemeType } from '../core/editor'

import IconHead from '../theme/markdown/head.svg?component'
import IconTable from '../theme/markdown/table.svg?component'
import IconMedia from '../theme/markdown/media.svg?component'
import IconBold from '../theme/markdown/bold.svg?component'
import IconStrikethrough from '../theme/markdown/strikethrough.svg?component'
import IconItalic from '../theme/markdown/italic.svg?component'
import IconTasklist from '../theme/markdown/tasklist.svg?component'
import IconOrderlist from '../theme/markdown/orderlist.svg?component'
import IconUnorderlist from '../theme/markdown/unorderlist.svg?component'
import IconLink from '../theme/markdown/link.svg?component'
import IconPreview from '../theme/markdown/preview.svg?component'
import IconBlockcode from '../theme/markdown/blockcode.svg?component'
import IconInlinecode from '../theme/markdown/inlinecode.svg?component'
import IconQuote from '../theme/markdown/quote.svg?component'
import IconSave from '../theme/markdown/save.svg?component'
import IconKeyboard from '../theme/markdown/keyboard.svg?component'
import IconSun from '../theme/markdown/sun.svg?component'
import IconFormat from '../theme/markdown/format.svg?component'
import IconDivider from '../theme/markdown/divider.svg?component'
import IconFullscreen from '../theme/markdown/fullscreen.svg?component'

const prettierConfig = {
  parser: 'markdown',
  plugins: [parserMarkdown]
}

export enum ToolbarItemTypes {
  head = 'Head',
  table = 'Table',
  media = 'Media',
  bold = 'Bold',
  strikethrough = 'Strikethrough',
  italic = 'Italic',
  tasklist = 'Tasklist',
  orderlist = 'Orderlist',
  unorderlist = 'Unorderlist',
  link = 'Link',
  preview = 'Preview',
  blockcode = 'Blockcode',
  inlinecode = 'Inlinecode',
  quote = 'Quote',
  save = 'Save',
  sun = 'Sun',
  helper = 'Helper',
  format = 'Format',
  divider = 'Divider',
  fullscreen = 'Fullscreen'
}

export interface ToolbarItemType {
  type: ToolbarItemTypes | string, 
  title: string, 
  icon: FunctionalComponent<SVGAttributes, {}>,
  shortcutKey?: string,
  action?: () => void,
  end?: (item: ToolbarItemType, type: string) => void
}

export interface ToolbarsType {
  top: ToolbarItemType[],
  center: ToolbarItemType[],
  bottom: ToolbarItemType[],
}

export default function createToolbar (editor: MarkdownEditor): ToolbarsType  {
  const Head: ToolbarItemType = {
    type: ToolbarItemTypes.head,
    title: '??????',
    icon: IconHead,
    shortcutKey: 'Ctrl-Alt-h',
    action: () => {
      editor.headAction()
    }
  }
  const Table: ToolbarItemType = {
    type: ToolbarItemTypes.table,
    title: '??????',
    icon: IconTable,
    shortcutKey: 'Ctrl-Alt-t',
    action: () => {
    }
  }
  const Media: ToolbarItemType = {
    type: ToolbarItemTypes.media,
    title: '??????',
    icon: IconMedia,
    shortcutKey: 'Ctrl-Alt-m',
    action: () => {
      editor.headAction()
    }
  }
  const Link: ToolbarItemType = {
    type: ToolbarItemTypes.link,
    title: '??????',
    icon: IconLink,
    shortcutKey: 'Shift-Alt-l',
    action: () => {
      editor.linkAction()
    }
  }
  const Preview: ToolbarItemType = {
    type: ToolbarItemTypes.preview,
    title: '??????',
    icon: IconPreview,
    shortcutKey: 'Ctrl-Alt-p',
    action: () => {
      editor.headAction()
    }
  }
  const Bold: ToolbarItemType = {
    type: ToolbarItemTypes.bold,
    title: '??????',
    icon: IconBold,
    shortcutKey: 'Ctrl-Alt-b',
    action: () => {
      editor.boldAction()
    }
  }
  const Strikethrough: ToolbarItemType = {
    type: ToolbarItemTypes.strikethrough,
    title: '?????????',
    icon: IconStrikethrough,
    shortcutKey: 'Ctrl-Alt-s',
    action: () => {
      editor.strikethroughAction()
    }
  }
  const Italic: ToolbarItemType = {
    type: ToolbarItemTypes.italic,
    title: '??????',
    icon: IconItalic,
    shortcutKey: 'Ctrl-Alt-i',
    action: () => {
      editor.italicAction()
    }
  }
  const Tasklist: ToolbarItemType = {
    type: ToolbarItemTypes.tasklist,
    title: '????????????',
    icon: IconTasklist,
    shortcutKey: 'Shift-Alt-t',
    action: () => {
      editor.tasklistAction()
    }
  }
  const Orderlist: ToolbarItemType = {
    type: ToolbarItemTypes.orderlist,
    title: '????????????',
    icon: IconOrderlist,
    shortcutKey: 'Shift-Alt-o',
    action: () => {
      editor.orderlistAction()
    }
  }
  const Unorderlist: ToolbarItemType = {
    type: ToolbarItemTypes.unorderlist,
    title: '????????????',
    icon: IconUnorderlist,
    shortcutKey: 'Shift-Alt-u',
    action: () => {
      editor.unorderlistAction()
    }
  }
  const Blockcode: ToolbarItemType = {
    type: ToolbarItemTypes.blockcode,
    title: '?????????',
    icon: IconBlockcode,
    shortcutKey: 'Shift-Alt-b',
    action: () => {
      editor.blockcodeAction()
    }
  }
  const Inlinecode: ToolbarItemType = {
    type: ToolbarItemTypes.inlinecode,
    title: '????????????',
    icon: IconInlinecode,
    shortcutKey: 'Shift-Alt-i',
    action: () => {
      editor.inlinecodeAction()
    }
  }
  const Quote: ToolbarItemType = {
    type: ToolbarItemTypes.quote,
    title: '??????',
    icon: IconQuote,
    shortcutKey: 'Ctrl-Alt-q',
    action: () => {
      editor.quoteAction()
    }
  }
  const Sun: ToolbarItemType = {
    type: ToolbarItemTypes.sun,
    title: '??????',
    icon: IconSun,
    shortcutKey: 'Alt-l',
    action: () => {
      const _change = () => {
        const _theme = editor.theme === ThemeType.DARK ? ThemeType.LIGHT : ThemeType.DARK
        editor.changThemeHandler(_theme)
        editor.theme = _theme
      }
      const opts = editor.options
      if (opts.theme?.observer !== false) {
        const _epx = opts.theme?.observer || ''
        const _attr = opts.theme?.observerAttr || ''
        if (_epx && _attr) {
          const body = editor.$$(_epx)
          if (body) {
            const val = editor.theme
            if (val === ThemeType.DARK) {
              body.removeAttribute(_attr)
            } else {
              body.setAttribute(_attr, ThemeType.DARK)
            }
          } else {
            _change()
          }
        } else {
          _change()
        }
      } else {
        _change()
      }
    }
  }
  const Helper: ToolbarItemType = {
    type: ToolbarItemTypes.helper,
    title: '????????????',
    icon: IconKeyboard,
    shortcutKey: 'Alt-h'
  }
  const Save: ToolbarItemType = {
    type: ToolbarItemTypes.save,
    title: '??????',
    icon: IconSave,
    shortcutKey: 'Ctrl-s',
    action: () => {
    }
  }
  const Format: ToolbarItemType = {
    type: ToolbarItemTypes.format,
    title: '????????????',
    icon: IconFormat,
    shortcutKey: 'Ctrl-b',
    action: () => {
      const value = editor.getValue()
      const _value = editor.prettier.format(value, prettierConfig)
      editor.setValue(_value)
    }
  }
  const Divider: ToolbarItemType = {
    type: ToolbarItemTypes.divider,
    title: '?????????',
    icon: IconDivider,
    shortcutKey: 'Ctrl-Alt-l',
    action: () => {
      editor.insertLineAfterCursor('\n---\n')
    }
  }
  const Fullscreen: ToolbarItemType = {
    type: ToolbarItemTypes.fullscreen,
    title: '??????',
    icon: IconFullscreen,
    shortcutKey: 'F11'
  }
  return {
    top: [],
    center: [
      Media,
      Link,
      Table,
      Tasklist,
      Orderlist,
      Unorderlist,
      Blockcode,
      Inlinecode,
      Head,
      Bold,
      Strikethrough,
      Italic,
      Quote,
      Divider,
      Preview,
      Format,
      Fullscreen
    ],
    bottom: [
      Sun,
      Helper,
      Save
    ]
  }
}
