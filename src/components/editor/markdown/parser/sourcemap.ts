import MarkdownIt from 'markdown-it'
import StateCore from 'markdown-it/lib/rules_core/state_core'

const sourcemap = (md: MarkdownIt) => {
  const types = Object.keys(md.renderer.rules)
  md.core.ruler.push('sourcemap', (state: StateCore) => {
    const tokens = state.tokens
    for (const token of tokens) {
      if (token.level === 0 && token.map !== null && (token.type.endsWith('_open') || types.includes(token.type))) {
        const start = `${token.map[0] + 1}`
        const end = `${token.map[1]}`
        token.attrPush(['data-source-start', start])
        token.attrPush(['data-source-end', end])
        token.attrPush(['data-source-level', '0'])
      }
    }
  })
}

export default sourcemap
