// plugins/remark/remark-span-words.ts
import type { Literal, Node, Parent, Text } from '@nuxtjs/mdc'
import { visit } from 'unist-util-visit'

// Define the plugin with explicit UnistPlugin typing
function remarkSpanWords() {
  return (tree: Node) => {
    let wordIndex = 0

    visit(tree, 'text', (node: Text, index: number | null, parent: Parent | null) => {
      if (!parent || index === null)
        return

      // Split the text into words, preserving punctuation
      const words = node.value.split(/(\s+)/)
      const newNodes: Literal[] = []

      words.forEach((word) => {
        // Preserve whitespace
        if (/^\s+$/.test(word)) {
          newNodes.push({
            type: 'text',
            value: word,
          })
          return
        }

        // Skip empty strings
        if (!word.trim())
          return

        // Create a span node for each non-whitespace word
        newNodes.push({
          type: 'html',
          value: `<span data-tts="${wordIndex}">${word}</span>`,
        })
        wordIndex++
      })

      // Replace the original text node with our new nodes
      parent.children.splice(index, 1, ...newNodes as any)
    })
  }
}

export default remarkSpanWords
