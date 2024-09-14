const SCRIM_FILL: [SolidPaint] = [{
  type: 'SOLID',
  color: { r: 0, g: 0, b: 0 },
  opacity: 0.25
}]

export default function () {
  let selection = figma.currentPage.selection
  if (selection.length > 1) {
    figma.notify('🔴 Multiple layers selected. Please select a single layer to scrim.')
  } else if (selection.length === 1) {
    processSelection(selection[0])
    figma.notify('Scrim created 🎉')
  } else {
    figma.notify('🔴 Nothing selected. Please select a layer to scrim.')
  }
  figma.closePlugin()
}

function processSelection(layer: SceneNode) {
  if (isTopLevelLayer(layer)) {
    if (isAutoLayout(layer)) scrimAutoLayout(layer as FrameNode)
    else if (isFrame(layer)) scrimFrame(layer as FrameNode)
    else if (isGroup(layer)) scrimGroup(layer as GroupNode)
    else scrimLayer(layer as SceneNode)
  }
  else {
    scrimLayer(layer)
  }
}

function scrimAutoLayout(autoLayout: FrameNode) {
  const scrim = figma.createRectangle()
  scrim.name = 'Scrim'
  scrim.fills = createScrimFill()
  scrim.resize(autoLayout.width, autoLayout.height)
  scrim.cornerSmoothing = autoLayout.cornerSmoothing
  scrim.topLeftRadius = autoLayout.topLeftRadius
  scrim.topRightRadius = autoLayout.topRightRadius
  scrim.bottomLeftRadius = autoLayout.bottomLeftRadius
  scrim.bottomRightRadius = autoLayout.bottomRightRadius

  scrim.constraints = {
    horizontal: 'SCALE',
    vertical: 'SCALE'
  }

  autoLayout.itemReverseZIndex ? autoLayout.insertChild(0, scrim) : autoLayout.appendChild(scrim)

  scrim.layoutPositioning = 'ABSOLUTE'
}

function scrimFrame(frame: FrameNode) {
  const scrim = figma.createRectangle()
  scrim.name = 'Scrim'
  scrim.fills = createScrimFill()
  scrim.resize(frame.width, frame.height)
  scrim.cornerSmoothing = frame.cornerSmoothing
  scrim.topLeftRadius = frame.topLeftRadius
  scrim.topRightRadius = frame.topRightRadius
  scrim.bottomLeftRadius = frame.bottomLeftRadius
  scrim.bottomRightRadius = frame.bottomRightRadius

  scrim.constraints = {
    horizontal: 'SCALE',
    vertical: 'SCALE'
  }

  frame.appendChild(scrim)
}

function scrimGroup(group: GroupNode) {
  let scrim = figma.createRectangle()
  scrim.name = 'Scrim'
  scrim.fills = createScrimFill()
  scrim.x = group.x;
  scrim.y = group.y;
  scrim.resize(group.width, group.height)
  
  group.appendChild(scrim)
}

function scrimLayer(layer: SceneNode) {
  const scrim = figma.createRectangle()
  scrim.name = 'Scrim'
  scrim.fills = createScrimFill()
  scrim.resize(layer.width, layer.height)
  scrim.x = layer.x
  scrim.y = layer.y

  layer.parent?.insertChild(layer.parent.children.indexOf(layer) + 1, scrim)
}

function createScrimFill(): [SolidPaint] {
  return [{
    type: 'SOLID',
    color: { r: 0, g: 0, b: 0 },
    opacity: 0.25
  }]
}

function isTopLevelLayer(layer: SceneNode): boolean {
  return layer.parent?.type === 'PAGE'
}

function isAutoLayout(node: SceneNode): boolean {
  return node.type === 'FRAME' && (node.layoutMode === 'HORIZONTAL' || node.layoutMode === 'VERTICAL')
}

function isFrame(node: SceneNode): boolean {
  return node.type === 'FRAME'
}

function isGroup(node: SceneNode): boolean {
  return node.type === 'GROUP'
}