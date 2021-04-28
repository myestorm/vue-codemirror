# vue-codemirror

codemirror vue组件

## 安装使用

```bash
npm install
npm run dev
```

访问：[http://localhost:3000/](http://localhost:3000/)

## 主要依赖

- codemirror 5.61.0
- markdown-it 12.0.6
- vue 3.0.11

## 主要实现功能

- [x] heading
- [x] bold
- [x] italic
- [x] quote
- [x] unorderedList
- [x] orderedList
- [x] taskList
- [x] link
- [x] media [图片/视频/音频]
- [x] codeBlock
- [x] table
- [x] fullscreen
- [x] live preview

## 不支持配置的原因

- 如果需要某些特定的东西，牵扯的东西太多 还不如下载源码修改
- 有一个ready事件，将整个editor抛出，基本上codemirror支持代码修改配置
- 预览样式的修改，那就要自己起文件了

## 学习中产生的笔记

### codemirror基本用法

```javascript
// gfm标准markdown编辑器为例
import CodeMirror from 'codemirror' // 导入codemirror

import 'codemirror/lib/codemirror.css' // 基本样式
import 'codemirror/theme/darcula.css' // 皮肤
import 'codemirror/mode/gfm/gfm.js' // gfm mode文件

// html：<textarea id="textarea-id"></textarea>
const id = 'textarea-id'
const editor = CodeMirror.fromTextArea(document.getElementById(id), {
  mode: 'gfm',
  theme: 'darcula',
  lineNumbers: true
})
console.log(editor.getValue()) // 输出编辑器的内容
```

### 常用功能示例

```javascript
const editor = CodeMirror.fromTextArea(this.textarea, {
    mode: 'gfm'
})
const doc = editor.getDoc()
insertAround (start, end) {
  const startPoint = doc.getCursor('start') // 获取起点位置
  const endPoint = doc.getCursor('end') // 获取结束位置
  const text = doc.getSelection() // 获取当前选区的文字
  doc.replaceSelection(start + text + end) // 替换选区的内容
  doc.setSelection(
    { line: startPoint.line, ch: startPoint.ch + start.length },
    { line: endPoint.line, ch: endPoint.ch + start.length }
  ) // 设置选区，因为加了东西，所以选区有变化，还原操作选区
  editor.focus() // 编辑器重新获得焦点
}
quote () {
    const startPoint = doc.getCursor('start')
    const endPoint = doc.getCursor('end')
    const startChar = '> '
    const endChar = ' '
    for (let i = startPoint.line; i <= endPoint.line; i++) { // 一行一行替换
      let text = doc.getLine(i) // 获取当前行的内容
      text = text.replace(new RegExp(`^${startChar}`), '') // 如果有了就干掉，保持一行只有一个
      text = text.replace(new RegExp(`${endChar}$`), '')
      doc.replaceRange(`${startChar}${text}${endChar}`, { line: i, ch: 0 }, { line: i })
    }
    doc.setCursor({line: endPoint.line, ch: endPoint.ch + startChar.length }) // 设置光标在结尾处
    editor.focus()
}
```

- 如果设置编辑器的高度？用css控制 `.CodeMirror { height: 600px; }`
- 获取值：editor.getValue()，赋值：editor.setValue('content')
- 获取当前光标所在行：doc.getCursor()
- 获取选区的开始和结束位置：doc.getCursor('start')，doc.getCursor('end')
- 获取行的内容：doc.getLine(lineNum) // 从0开始
- 获取当前选区内容：doc.getSelection()
- 获取指定范围内容：
doc.getRange(
{ line: 开始行数, ch: 从开始行数第几个字符开始 },
{ line: 结束行数, ch: 到结束行数的第几个字符结束 }
)
- 编辑器获取焦点：editor.focus()
- 设置光标位置：doc.setCursor({line: 行数, ch: 第几个字符 })
- 替换选区内容：doc.replaceRange('替换字符', { line: 选区开始行数, ch: 选区开始字符 }, { line: 选区结束行数 })，如果结束不指定ch，则表示结尾行到结尾处
- 设置选区：doc.setSelection(
{ line: startPoint.line, ch: startPoint.ch },
{ line: endPoint.line, ch: endPoint.ch }
)
- 编辑器绑定事件：editor.on('scroll', editorScroll)
- 编辑器卸载事件：editor.off('scroll', editorScroll)

### 配置（Configuration）

- **value**：编辑器初始值
- **mode**：编辑器模式 具体的值对应codemirror/mode下的文件夹名称一致
- **lineSeparator**：行分隔符 一般不用设置，就是换行符的意思 CRLF或LF
- **theme**：主题，具体的值对应codemirror/theme下的css名称一致
- **indentUnit**：一个块应该缩进多少空格，默认值是2
- **smartIndent**：是否使用模式提供的上下文敏感的缩进(或只缩进与前面的行相同)，默认是true
- **tabSize**：tab的宽度，默认是4
- **indentWithTabs**：是否将tabSize大小的空格替换成tab，默认是false
- **electricChars**：当输入的字符可能改变其正确的缩进(仅在模式支持缩进时有效)时，编辑器是否应该重新缩进当前行，默认true
- **specialChars**：正则表达式，用来匹配那些字符需要被一个特殊占位符替换。默认值/[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b-\u200f\u2028\u2029\ufeff\ufff9-\ufffc]/
- **specialCharPlaceholder**：函数，如果给定由specialChars选项标识的特殊字符，则生成用于表示该字符的DOM节点。默认情况下，会显示一个红点(•)，并带有一个标题工具提示来指示字符代码。
- **direction**：文本方向（ltr：从左到右 rtl：从右到左），默认ltr
- **rtlMoveVisually**：我猜想的意思是，rtl模式时，输入文字时从左到右，输入完成后对光标位置的显示，默认值，window下时false，其他系统时true
- **keyMap**：使用的按键类型，或者是快捷键的类型 对应目录codemirror/keymap的文件名
- **extraKeys**：用来绑定指定键的事件，比如按F11全屏等，Esc退出全屏
- **configureMouse**：配置鼠标行为，按鼠标左键调用该函数
- **lineWrapping**：超长是否自动换行，默认时 false（不换行，显示滚动条）
- **lineNumbers**：是否显示行号，默认false
- **firstLineNumber**：开始行号，默认1
- **lineNumberFormatter**：格式化行号函数，return出最终显示的内容
- **gutters**：添加额外的className和style
- **fixedGutter**：是否固定行号区域，当出现滚动条时，行号区域一直存在，默认true
- **scrollbarStyle**：滚动条样式
- **coverGutterNextToScrollbar**：当fixedGutter打开，并且有一个水平滚动条时，默认情况下，该滚动条的左侧是可见的，如果这个选项被设置为true，它将被一个带有codemmirror-gutter-filler的元素覆盖。
- **inputStyle**：设置编辑方式或类型。手机浏览器，默认是contenteditable，桌面浏览器默认是textarea
- **readOnly**：是否只读，如果是“nocursor”(而不是true)，也不允许编辑器聚焦。
- **screenReaderLabel**：当聚焦CodeMirror文本区域时，屏幕阅读器读取此标签。这对可访问性很有帮助。
- **showCursorWhenSelecting**：当选择处于活动状态时是否应该绘制光标，默认为false
- **lineWiseCopyCut**：当没有选择，当复制或剪切时，复制或剪切的就是光标所在行，默认true
- **pasteLinesPerSelection**：当从外部源(而不是从编辑器本身)粘贴内容时，如果行数与所选内容的行数匹配，codemmirror将默认为每个所选内容插入一行。您可以将此设置为false来禁用该行为。
- **selectionsMayTouch**：Determines whether multiple selections are joined as soon as they touch (the default) or only when they overlap (true). 没理解是什么意思
- **undoDepth**：撤销的最大级别，默认是200
- **historyEventDelay**：不活动的时间(以毫秒为单位)，在输入或删除时将导致一个新的历史事件开始。默认为1250。
- **tabindex**：要分配给编辑器的制表符索引。如果没有给出，将不会分配制表符索引。
- **autofocus**：是否自动获取焦点，默认false
- **phrases**：应该与多语言有关，没有具体的实践
- **dragDrop**：是否允许拖拽，默认打开
- **allowDropFileTypes**：允许拖拽的文件类型
- **cursorBlinkRate**：光标闪烁频率。默认530ms，0禁用闪烁，负值时隐藏
- **cursorScrollMargin**：在可滚动文档中，当接近可见视图的顶部或底部时，光标上方和下方总是保留多少额外空间。默认值为0。
- **cursorHeight**：光标高度。默认1
- **singleCursorHeightPerLine**：如果设置为true(默认值)，将保持整行(或换行部分)的光标高度不变。当为false时，光标的高度基于相邻参考字符的高度。
- **resetSelectionOnContextMenu**：右键时，是否把光标移动到当前位置，默认时true
- **workTime**, **workDelay**：高亮显示是由一个伪后台线程完成的，该线程工作时间为workTime毫秒，然后使用timeout休眠工作时间为workDelay毫秒。默认值是200和300，您可以更改这些选项，使高亮显示更大胆或更低调。
- **pollInterval**：轮询速度，默认100ms。大多数输入都是由事件捕获的，但是有些东西，比如某些浏览器上的IME输入，并不生成允许codemmirror正确检测它的事件。
- **flattenSpans**：默认true，表现是一行文字在同一个span内，为false，每个字符都是独立dom节点
- **addModeClass**：当启用(默认为关闭)时，一个额外的class将被添加到每个标记中，指示产生它的(内部)模式，前缀为“cm-m-”
- **maxHighlightLength**：当突出显示较长的行时，为了保持响应性，编辑器将放弃，并在该行到达特定位置时简单地将该行其余部分设置为纯文本样式。缺省值是10000。你可以将其设置为Infinity来关闭这种行为。
- **viewportMargin**：指定当前滚动到视图中的文档部分的上方和下方呈现的行数。这将影响滚动时所需的更新量，以及此类更新所做的工作量。您通常应该保持它的默认值10。可以设置为无限，以确保整个文档总是呈现，因此浏览器的文本搜索工作。这将对大文档的性能产生不良影响。
- **spellcheck**：是否启用拼写检查
- **autocorrect**：是否启用自动更正
- **autocapitalize**：是否自动启用大写

### 事件（Events）

#### editor instance

- **change**
- **changes**
- **beforeChange**
- **cursorActivity**：将在光标或所选内容移动或对编辑器内容进行任何更改时触发
- **keyHandled**：按键事件
- **inputRead**：每当从隐藏文本区域(由用户输入或粘贴)读取新输入时触发。
- **electricInput**：如果文本输入与模式的electric patterns匹配，则触发
- **beforeSelectionChange**：选区变化
- **viewportChange**：视图变化
- **swapDoc**：当使用swapDoc方法替换编辑器的文档时
- **gutterClick**：行号点击
- **gutterContextMenu**：行号右键点击
- **focus**
- **blur**
- **scroll**
- **refresh**：编辑器更新或窗口大小发生变换
- **optionChange**：配置变化
- **scrollCursorIntoView**：当编辑器试图将光标滚动到视图中时触发
- **update**：更新dom
- **renderLine**：行渲染是触发
- **"mousedown"**, **"dblclick"**, **"touchstart"**, **"contextmenu"**, **"keydown"**, **"keypress"**, **"keyup"**, **"cut"**, **"copy"**, **"paste"**, **"dragstart"**, **"dragenter"**, **"dragover"**, **"dragleave"**, **"drop"**

#### CodeMirror.Doc

- **change**
- **beforeChange**
- **cursorActivity**
- **beforeSelectionChange**

#### Line handles

- **delete**
- **change**

#### Marked range handles

- **beforeCursorEnter**
- **clear**
- **hide**
- **unhide**

#### Line widgets

- **redraw**

### 快捷键（Key Maps）

```javascript
editor.setOption("extraKeys", {
  Tab: function(cm) {
    var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
    cm.replaceSelection(spaces);
  }
});
```

### 指令（Commands）

Command和Event的区别：Command是要执行，但是还没有执行，Event表示已经发生了

- **selectAll**：全选
- **singleSelection**：当出现多个选择时，这将取消除主要选择外的所有选择
- **killLine**
- **deleteLine**
- **delLineLeft**
- **delWrappedLineLeft**
- **delWrappedLineRight**
- **undo**
- **redo**
- **undoSelection**
- **redoSelection**
- **goDocStart**
- **goDocEnd**
- **goLineStart**
- **goLineStartSmart**
- **goLineEnd**
- **goLineRight**
- **goLineLeft**
- **goLineLeftSmart**
- **goLineUp**
- **goLineDown**
- **goPageUp**
- **goPageDown**
- **goCharLeft**
- **goCharRight**
- **goColumnLeft**
- **goColumnRight**
- **goWordLeft**
- **goWordRight**
- **goGroupLeft**
- **goGroupRight**
- **delCharBefore**
- **delCharAfter**
- **delWordBefore**
- **delWordAfter**
- **delGroupBefore**
- **delGroupAfter**
- **indentAuto**
- **indentMore**
- **indentLess**
- **insertTab**
- **insertSoftTab**
- **defaultTab**
- **transposeChars**
- **newlineAndIndent**
- **toggleOverwrite**
- **save**
- **find**
- **findNext**
- **findPrev**
- **replace**
- **replaceAll**

### 插件（Addons）

- **dialog/dialog.js**：用简单的方式来显示自定义文本
- **search/searchcursor.js**：搜索、替换文档内容
- **search/search.js**：搜索、替换文档内容
- **search/jump-to-line.js**：跳转到指定行
- **search/matchesonscrollbar.js**
- **edit/matchbrackets.js**：匹配对应括号
- **edit/closebrackets.js**：自动关闭括号
- **edit/matchtags.js**：成对标签高亮
- **edit/trailingspace.js**：添加行尾的空白
- **edit/closetag.js**：自动关闭标签
- **edit/continuelist.js**：自动引导列表，如markdown输入列表时，回车后自动插入列表标识
- **comment/comment.js**：添加注释
- **fold/foldcode.js**：代码折叠
- **fold/foldgutter.js**
- **runmode/runmode.js**
- **runmode/colorize.js**
- **mode/overlay.js**
- **mode/multiplex.js**
- **hint/show-hint.js**
- **hint/xml-hint.js**
- **hint/javascript-hint.js**
- **hint/html-hint.js**
- **hint/css-hint.js**
- **hint/anyword-hint.js**
- **hint/sql-hint.js**
- **search/match-highlighter.js**：关键字高亮
- **lint/lint.js**：语法检查
- **selection/mark-selection.js**：标记选区
- **selection/active-line.js**：当前行高亮
- **selection/selection-pointer.js**
- **mode/loadmode.js**：载入mode
- **mode/meta.js**
- **comment/continuecomment.js**
- **display/placeholder.js**
- **display/fullscreen.js**：全屏
- **display/autorefresh.js**
- **scroll/simplescrollbars.js**
- **scroll/annotatescrollbar.js**
- **display/rulers.js**
- **display/panel.js**
- **wrap/hardwrap.js**：不要对文本段落执行硬换行
- **scroll/scrollpastend.js**
- **merge/merge.js**
- **tern/tern.js**
