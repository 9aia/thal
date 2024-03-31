import type { Node } from '../types'

export function getUnits (nodes: Node[], i = 100) {
  return nodes.map<Node>((node, j) => {
    const isEven = Boolean(j % 2)

    return {
      id: String(j),
      ...node,
      position: !isEven ? 'start' : 'end',
      active: j < i,
    }
  })
}

export function getBase64(file: Blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
