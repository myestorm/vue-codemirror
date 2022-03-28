import { FunctionalComponent, SVGAttributes } from 'vue'

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
  helper = 'Helper'
}

export interface ToolbarItemType {
  type: ToolbarItemTypes, 
  title: string, 
  icon: FunctionalComponent<SVGAttributes, {}>,
  shortcutKey?: string,
  action?: () => void
}

export interface ToolbarsType {
  top: ToolbarItemType[],
  center: ToolbarItemType[],
  bottom: ToolbarItemType[],
}

export default function createToolbar<T> (editor: T): ToolbarsType  {
  const Head: ToolbarItemType = {
    type: ToolbarItemTypes.head,
    title: '标题',
    icon: IconHead,
    action: () => {
      console.log(123, editor)
    }
  }
  const Table: ToolbarItemType = {
    type: ToolbarItemTypes.table,
    title: '表格',
    icon: IconTable
  }
  const Media: ToolbarItemType = {
    type: ToolbarItemTypes.media,
    title: '媒体',
    icon: IconMedia
  }
  const Bold: ToolbarItemType = {
    type: ToolbarItemTypes.bold,
    title: '加粗',
    icon: IconBold
  }
  const Strikethrough: ToolbarItemType = {
    type: ToolbarItemTypes.strikethrough,
    title: '删除线',
    icon: IconStrikethrough
  }
  const Italic: ToolbarItemType = {
    type: ToolbarItemTypes.italic,
    title: '斜体',
    icon: IconItalic
  }
  const Tasklist: ToolbarItemType = {
    type: ToolbarItemTypes.tasklist,
    title: '任务列表',
    icon: IconTasklist
  }
  const Orderlist: ToolbarItemType = {
    type: ToolbarItemTypes.orderlist,
    title: '有序列表',
    icon: IconOrderlist
  }
  const Unorderlist: ToolbarItemType = {
    type: ToolbarItemTypes.unorderlist,
    title: '无序列表',
    icon: IconUnorderlist
  }
  const Link: ToolbarItemType = {
    type: ToolbarItemTypes.link,
    title: '链接',
    icon: IconLink
  }
  const Preview: ToolbarItemType = {
    type: ToolbarItemTypes.preview,
    title: '预览',
    icon: IconPreview
  }
  const Blockcode: ToolbarItemType = {
    type: ToolbarItemTypes.blockcode,
    title: '代码块',
    icon: IconBlockcode
  }
  const Inlinecode: ToolbarItemType = {
    type: ToolbarItemTypes.inlinecode,
    title: '行间代码',
    icon: IconInlinecode
  }
  const Quote: ToolbarItemType = {
    type: ToolbarItemTypes.quote,
    title: '引用',
    icon: IconQuote
  }
  const Sun: ToolbarItemType = {
    type: ToolbarItemTypes.sun,
    title: '明暗',
    icon: IconSun
  }
  const Helper: ToolbarItemType = {
    type: ToolbarItemTypes.helper,
    title: '快捷键',
    icon: IconKeyboard
  }
  const Save: ToolbarItemType = {
    type: ToolbarItemTypes.save,
    title: '保存',
    shortcutKey: 'Ctrl-s',
    icon: IconSave
  }
  return {
    top: [],
    center: [
      Head,
      Table,
      Media,
      Bold,
      Strikethrough,
      Italic,
      Tasklist,
      Orderlist,
      Unorderlist,
      Link,
      Blockcode,
      Inlinecode,
      Quote,
      Preview
    ],
    bottom: [
      Sun,
      Helper,
      Save
    ]
  }
}
