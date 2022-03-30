import { FunctionalComponent, SVGAttributes } from 'vue'
import parserMarkdown from 'prettier/parser-markdown'
import MarkdownEditor, { MarkdownThemeType } from './index'

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
  type: ToolbarItemTypes, 
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
    title: '标题',
    icon: IconHead,
    shortcutKey: 'Ctrl-Alt-h',
    action: () => {
      editor.headAction()
    }
  }
  const Table: ToolbarItemType = {
    type: ToolbarItemTypes.table,
    title: '表格',
    icon: IconTable,
    shortcutKey: 'Ctrl-Alt-t',
    action: () => {
    }
  }
  const Media: ToolbarItemType = {
    type: ToolbarItemTypes.media,
    title: '媒体',
    icon: IconMedia,
    shortcutKey: 'Ctrl-Alt-m',
    action: () => {
      editor.headAction()
    }
  }
  const Link: ToolbarItemType = {
    type: ToolbarItemTypes.link,
    title: '链接',
    icon: IconLink,
    shortcutKey: 'Shift-Alt-l',
    action: () => {
      editor.linkAction()
    }
  }
  const Preview: ToolbarItemType = {
    type: ToolbarItemTypes.preview,
    title: '预览',
    icon: IconPreview,
    shortcutKey: 'Ctrl-Alt-p',
    action: () => {
      editor.headAction()
    }
  }
  const Bold: ToolbarItemType = {
    type: ToolbarItemTypes.bold,
    title: '加粗',
    icon: IconBold,
    shortcutKey: 'Ctrl-Alt-b',
    action: () => {
      editor.boldAction()
    }
  }
  const Strikethrough: ToolbarItemType = {
    type: ToolbarItemTypes.strikethrough,
    title: '删除线',
    icon: IconStrikethrough,
    shortcutKey: 'Ctrl-Alt-s',
    action: () => {
      editor.strikethroughAction()
    }
  }
  const Italic: ToolbarItemType = {
    type: ToolbarItemTypes.italic,
    title: '斜体',
    icon: IconItalic,
    shortcutKey: 'Ctrl-Alt-i',
    action: () => {
      editor.italicAction()
    }
  }
  const Tasklist: ToolbarItemType = {
    type: ToolbarItemTypes.tasklist,
    title: '任务列表',
    icon: IconTasklist,
    shortcutKey: 'Shift-Alt-t',
    action: () => {
      editor.tasklistAction()
    }
  }
  const Orderlist: ToolbarItemType = {
    type: ToolbarItemTypes.orderlist,
    title: '有序列表',
    icon: IconOrderlist,
    shortcutKey: 'Shift-Alt-o',
    action: () => {
      editor.orderlistAction()
    }
  }
  const Unorderlist: ToolbarItemType = {
    type: ToolbarItemTypes.unorderlist,
    title: '无序列表',
    icon: IconUnorderlist,
    shortcutKey: 'Shift-Alt-u',
    action: () => {
      editor.unorderlistAction()
    }
  }
  const Blockcode: ToolbarItemType = {
    type: ToolbarItemTypes.blockcode,
    title: '代码块',
    icon: IconBlockcode,
    shortcutKey: 'Shift-Alt-b',
    action: () => {
      editor.blockcodeAction()
    }
  }
  const Inlinecode: ToolbarItemType = {
    type: ToolbarItemTypes.inlinecode,
    title: '行间代码',
    icon: IconInlinecode,
    shortcutKey: 'Shift-Alt-i',
    action: () => {
      editor.inlinecodeAction()
    }
  }
  const Quote: ToolbarItemType = {
    type: ToolbarItemTypes.quote,
    title: '引用',
    icon: IconQuote,
    shortcutKey: 'Ctrl-Alt-q',
    action: () => {
      editor.quoteAction()
    }
  }
  const Sun: ToolbarItemType = {
    type: ToolbarItemTypes.sun,
    title: '明暗',
    icon: IconSun,
    shortcutKey: 'Alt-l',
    action: () => {
      const _change = () => {
        const _theme = editor.theme === MarkdownThemeType.DARK ? MarkdownThemeType.LIGHT : MarkdownThemeType.DARK
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
            if (val === MarkdownThemeType.DARK) {
              body.removeAttribute(_attr)
            } else {
              body.setAttribute(_attr, MarkdownThemeType.DARK)
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
    title: '帮助文档',
    icon: IconKeyboard,
    shortcutKey: 'Alt-h'
  }
  const Save: ToolbarItemType = {
    type: ToolbarItemTypes.save,
    title: '保存',
    icon: IconSave,
    shortcutKey: 'Ctrl-s',
    action: () => {
    }
  }
  const Format: ToolbarItemType = {
    type: ToolbarItemTypes.format,
    title: '格式美化',
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
    title: '分割线',
    icon: IconDivider,
    shortcutKey: 'Ctrl-Alt-l',
    action: () => {
      editor.insertLineAfterCursor('\n---\n')
    }
  }
  const Fullscreen: ToolbarItemType = {
    type: ToolbarItemTypes.fullscreen,
    title: '全屏',
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
