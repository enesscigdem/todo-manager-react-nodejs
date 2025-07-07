class HoverGradientPainter {
  static get inputProperties() { return ['--hover-color'] }

  paint(ctx, geom, properties) {
    const color = properties.get('--hover-color').toString() || 'rgba(0,0,0,0.1)'
    const gradient = ctx.createLinearGradient(0, 0, geom.width, geom.height)
    gradient.addColorStop(0, color)
    gradient.addColorStop(1, 'transparent')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, geom.width, geom.height)
  }
}
registerPaint('hover-gradient', HoverGradientPainter)
