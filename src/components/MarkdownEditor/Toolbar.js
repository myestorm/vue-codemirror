const toolbar = [
  {
    title: '标题',
    icon: ['med', 'medheading'],
    name: 'header'
  },
  {
    title: '加粗',
    icon: ['med', 'medbold'],
    name: 'bold'
  },
  {
    title: '斜体',
    icon: ['med', 'meditalic'],
    name: 'italic'
  },
  '-',
  {
    title: '引用',
    icon: ['med', 'medquote'],
    name: 'quote'
  },
  {
    title: '无序列表',
    icon: ['med', 'medunordered-list'],
    name: 'unorderedList'
  },
  {
    title: '有序列表',
    icon: ['med', 'medordered-list'],
    name: 'orderedList'
  },
  {
    title: '任务列表',
    icon: ['med', 'medtask-list'],
    name: 'taskList'
  },
  '-',
  {
    title: '链接',
    icon: ['med', 'medlink'],
    name: 'link'
  },
  {
    title: '图片/视频/音频',
    icon: ['med', 'medimage'],
    name: 'media'
  },
  {
    title: '代码块',
    icon: ['med', 'medcode'],
    name: 'codeBlock'
  },
  {
    title: '表格',
    icon: ['med', 'medtable'],
    name: 'table'
  },
  '->',
  {
    title: '全屏',
    icon: ['med', 'medfull-screen'],
    name: 'fullscreen'
  },
  {
    title: '预览',
    icon: ['med', 'medpreview'],
    name: 'preview'
  }
]
export function getNames () {
  const names = []
  toolbar.forEach(item => {
    names.push(item.name)
  })
  return names
}
export default toolbar
