import {ViewStyle} from 'react-ult/dist/common/Types';
import {getColor, getBoundingBox} from './utils';

export function getOpacity(node: BlendMixin): ViewStyle {
  if (node.opacity === 1) return {};
  return {opacity: node.opacity};
}

export function getRounding(node: RectangleNode): ViewStyle {
  return {
    borderTopLeftRadius: node.topLeftRadius,
    borderTopRightRadius: node.topRightRadius,
    borderBottomLeftRadius: node.topLeftRadius,
    borderBottomRightRadius: node.bottomRightRadius,
  };
}

export function getOutline(width: number, paints: ReadonlyArray<Paint>): ViewStyle {
  for (const paint of paints) {
    if (!paint.visible) continue;
    switch (paint.type) {
      case 'SOLID':
        return {
          borderWidth: width,
          borderColor: getColor(paint.color, paint.opacity),
        };
    }
  }
}

export function getBackground(paints: ReadonlyArray<Paint>): ViewStyle {
  for (const paint of paints) {
    if (!paint.visible) continue;
    switch (paint.type) {
      case 'SOLID':
        return {
          backgroundColor: getColor(paint.color, paint.opacity),
        };
    }
  }
}

export function getEffect(node: BaseNode & BlendMixin): ViewStyle {
  let styles: ViewStyle = {};
  for (const effect of node.effects) {
    if (!effect.visible) continue;
    if (effect.type === 'DROP_SHADOW') {
      styles = {
        ...styles,
        elevation: 1,
        shadowColor: getColor(effect.color),
        shadowOpacity: effect.color.a,
        shadowRadius: effect.radius,
        shadowOffset: {
          width: effect.offset.x,
          height: effect.offset.y,
        },
      };
    }
  }
  return styles;
}

export function getLayout(node: BaseNode & LayoutMixin) {
  const {x, y, width, height} = getBoundingBox(node);

  let outerClass = 'outerDiv';
  let lastGroupParent: GroupNode | null = null;
  let parent = node.parent as BaseNode & LayoutMixin & ChildrenMixin;
  let isFirstChild = parent.children.indexOf(node as SceneNode) === 0;

  while (parent.type === "GROUP") {
    lastGroupParent = parent
    parent = parent.parent as BaseNode & LayoutMixin & ChildrenMixin
    if (!('layoutMode' in parent)) {
      isFirstChild = isFirstChild && (parent.children.indexOf(lastGroupParent) === 0)
    }
  }

  const rect = getBoundingBox(parent);
  let px = rect.x;
  let py = rect.y;
  const bounds = {
    left: x - px,
    right: px + rect.width - (x + width),
    top: y - py,
    bottom: py + rect.height - (y + height),
    width: width,
    height: height,
  };

  let candidate = node as BaseNode & ChildrenMixin
  while (!('constraints' in candidate)) {
    candidate = candidate.children[0] as BaseNode & ChildrenMixin
  }

  const inner: { [key: string]: number | string } = {}
  const outer: { [key: string]: number | string } = {}

  let cHorizontal = (candidate as ConstraintMixin).constraints.horizontal
  let vHorizontal = (candidate as ConstraintMixin).constraints.vertical

  if ('layoutMode' in parent && parent.layoutMode === "VERTICAL") {
    cHorizontal = lastGroupParent ? lastGroupParent.layoutAlign : node.layoutAlign
    outerClass = "autolayoutVchild"
    if (lastGroupParent) {
      outer["padding-bottom"] = `${lastGroupParent.height - bounds.height - (node.y - lastGroupParent.y)}px`
    }

    if (!isFirstChild) {
      if (lastGroupParent && bounds) {
        outer["margin-top"] = `${-lastGroupParent.height + (node.y - lastGroupParent.y)}px`
      } else if (parent.constraints.vertical !== "STRETCH") {
        outer["margin-top"] = `${parent.itemSpacing}px`
      }
    } else if (parent.constraints.vertical !== "STRETCH" && lastGroupParent && lastGroupParent.parent!.children.indexOf(lastGroupParent) !== 0) {
      outer["margin-top"] = `${parent.itemSpacing}px`
    }

    if (node.type === "FRAME" || node.type === "COMPONENT" || node.type === "INSTANCE") {
      if (node.layoutMode === "NONE") {
        outer["min-height"] = `${bounds.height}px`
      }
    }
  } else if ('layoutMode' in parent && parent.layoutMode === "HORIZONTAL") {
    vHorizontal = lastGroupParent ? lastGroupParent.layoutAlign : node.layoutAlign

    outerClass = "autolayoutHchild"

    if (lastGroupParent) {
      outer["padding-right"] = `${lastGroupParent.width - bounds.width - (node.x - lastGroupParent.x)}px`
    }

    if (!isFirstChild) {
      if (lastGroupParent && bounds) {
        outer["margin-left"] = `${-lastGroupParent.width + (node.x - lastGroupParent.x)}px`
      } else if (parent.constraints.horizontal !== "STRETCH") {
        outer["margin-left"] = `${parent.itemSpacing}px`
      }
    } else if (parent.constraints.horizontal !== "STRETCH" && lastGroupParent && lastGroupParent.parent!.children.indexOf(lastGroupParent) !== 0) {
      outer["margin-left"] = `${parent.itemSpacing}px`
    }
  }

  if ('layoutMode' in node && node.layoutMode !== "NONE") {
    inner["display"] = "flex"
    if (node.layoutMode === "VERTICAL") {
      inner["flex-direction"] = "column"
      if (node.constraints.vertical === "STRETCH") {
        inner["justify-content"] = "space-between"
      }
      inner["padding"] = `${node.verticalPadding}px 0`
    } else {
      if (node.constraints.horizontal === "STRETCH") {
        inner["justify-content"] = "space-between"
      }
      inner["padding"] = `0 ${node.horizontalPadding}px`
    }
  }

  if (outerClass !== "autolayoutHchild") {
    if (cHorizontal === "STRETCH") {
      inner["margin-left"] = `${bounds.left}px`
      inner["margin-right"] = `${bounds.right}px`
      inner["flex-grow"] = 1
    } else if (cHorizontal === "MAX") {
      outer["justify-content"] = "flex-end"
      inner["margin-right"] = `${bounds.right}px`
      inner["width"] = `${bounds.width}px`
      inner["min-width"] = `${bounds.width}px`
    } else if (cHorizontal === "CENTER") {
      outer["justify-content"] = "center"
      inner["width"] = `${bounds.width}px`
      if (bounds.left && bounds.right) inner["margin-left"] = `${bounds.left - bounds.right}px`
    } else if (cHorizontal === "SCALE") {
      const parentWidth = bounds.left + bounds.width + bounds.right
      inner["width"] = `${bounds.width * 100 / parentWidth}%`
      inner["margin-left"] = `${bounds.left * 100 / parentWidth}%`
    } else {
      inner["margin-left"] = `${bounds.left}px`
      inner["width"] = `${bounds.width}px`
      inner["min-width"] = `${bounds.width}px`
    }
  }

  if (outerClass !== "autolayoutVchild") {
    if (vHorizontal === "STRETCH") {
      inner["margin-top"] = `${bounds.top}px`
      inner["margin-bottom"] = `${bounds.bottom}px`
      inner["flex-grow"] = 1
    } else if (vHorizontal === "MAX") {
      outer["align-items"] = "flex-end"
      inner["margin-bottom"] = `${bounds.bottom}px`
      inner["height"] = `${bounds.height}px`
      inner["min-height"] = `${bounds.height}px`
    } else if (vHorizontal === "CENTER") {
      outer["align-items"] = "center"
      inner["height"] = `${bounds.height}px`
      inner["margin-top"] = `${bounds.top - bounds.bottom}px`
    } else if (vHorizontal === "SCALE") {
      const parentWidth = bounds.top + bounds.height + bounds.bottom
      inner["height"] = `${bounds.height * 100 / parentWidth}%`
      inner["margin-top"] = `${bounds.top * 100 / parentWidth}%`
    } else {
      inner["margin-top"] = `${bounds.top}px`
      inner["height"] = `${bounds.height}px`
      inner["min-height"] = `${bounds.height}px`
    }
  }

  if (node.type === "TEXT") {
    inner["display"] = "flex"
    if (node.textAlignVertical === "CENTER") {
      inner["align-items"] = "center"
    } else if (node.textAlignVertical === "BOTTOM") {
      inner["align-items"] = "flex-end"
    }

    if (node.textAlignHorizontal === "CENTER") {
      inner["justify-content"] = "center"
    } else if (node.textAlignHorizontal === "RIGHT") {
      inner["justify-content"] = "flex-end"
    }
  }

  return {inner, outer, outerClass}
}
