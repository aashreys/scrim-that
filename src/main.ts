const NOTI_TIME_LONG = 5000;

export default function () {
  let selection = figma.currentPage.selection;
  if (selection.length > 1) {
    showError('More than one layer selected. Please select a single layer to scrim.', NOTI_TIME_LONG)
  } else if (selection.length === 1) {
    processSelection(selection[0])
  } else {
    showError('Nothing selected. Please select a layer to scrim.', NOTI_TIME_LONG)
  }
  figma.closePlugin()
}

function processSelection(layer: SceneNode) {
  if (isFrame(layer)) {
    scrimFrame(layer as FrameNode)
  } else if (isGroup(layer)) {
    scrimGroup(layer as GroupNode)
  } else if (isShape(layer)) {
    scrimShape(layer)
  } else {
    showError('Unsupported layer. Please select a Frame, Group or Shape layer to scrim.', NOTI_TIME_LONG)
  }
}

function scrimFrame(container: FrameNode) {
  let scrim = figma.createRectangle()
  scrim.name = 'Scrim'
  scrim.fills = [createScrimFill()]
  scrim.x = container.x;
  scrim.y = container.y;
  scrim.resize(container.width, container.height)
  scrim.cornerSmoothing = (container as any).cornerSmoothing
  scrim.topLeftRadius = (container as any).topLeftRadius
  scrim.topRightRadius = (container as any).topRightRadius
  scrim.bottomLeftRadius = (container as any).bottomLeftRadius
  scrim.bottomRightRadius = (container as any).bottomRightRadius
  container.parent?.insertChild(container.parent.children.indexOf(container) + 1, scrim)
}

function scrimGroup(container: GroupNode) {
  let scrim = figma.createRectangle()
  scrim.name = 'Scrim'
  scrim.fills = [createScrimFill()]
  scrim.x = container.x;
  scrim.y = container.y;
  scrim.resize(container.width, container.height)
  container.parent?.insertChild(container.parent.children.indexOf(container) + 1, scrim)
}

function scrimShape(shape: SceneNode) {
  let scrim: any = shape.clone()
  scrim.name = 'Scrim'
  scrim.fills = [createScrimFill()]
}

function createScrimFill(): SolidPaint {
  return {
    type: 'SOLID',
    color: { r: 0, g: 0, b: 0 },
    opacity: 0.25
  }
}

function isFrame(node: SceneNode): boolean {
  return node.type === 'FRAME'
}

function isGroup(node: SceneNode): boolean {
  return node.type === 'GROUP'
}

function isShape(node: SceneNode): boolean {
  return node.type === 'ELLIPSE' ||
  node.type === 'POLYGON' ||
  node.type === 'RECTANGLE' ||
  node.type === 'STAR' ||
  node.type === 'VECTOR'
}

function showError(message: string, time: number) {
  figma.notify(
    message,
    { timeout: time }
  )
}