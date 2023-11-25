const autoAdjustOverflow = {
  adjustX: 1,
  adjustY: 1,
};

export const placements = {
  topLeft: {
    points: ['bl', 'tl'],
    overflow: autoAdjustOverflow,
  },
  topRight: {
    points: ['br', 'tr'],
    overflow: autoAdjustOverflow,
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: autoAdjustOverflow,
  },
  bottomRight: {
    points: ['tr', 'br'],
    overflow: autoAdjustOverflow,
  },
  leftTop: {
    points: ['tr', 'tl'],
    overflow: autoAdjustOverflow,
  },
  leftBottom: {
    points: ['br', 'bl'],
    overflow: autoAdjustOverflow,
  },
  rightTop: {
    points: ['tl', 'tr'],
    overflow: autoAdjustOverflow,
  },
  rightBottom: {
    points: ['bl', 'br'],
    overflow: autoAdjustOverflow,
  }
};

export const placementsRtl = {
  topLeft: {
    points: ['bl', 'tl'],
    overflow: autoAdjustOverflow,
  },
  topRight: {
    points: ['br', 'tr'],
    overflow: autoAdjustOverflow,
  },
  bottomLeft: {
    points: ['tl', 'bl'],
    overflow: autoAdjustOverflow,
  },
  bottomRight: {
    points: ['tr', 'br'],
    overflow: autoAdjustOverflow,
  },
  rightTop: {
    points: ['tr', 'tl'],
    overflow: autoAdjustOverflow,
  },
  rightBottom: {
    points: ['br', 'bl'],
    overflow: autoAdjustOverflow,
  },
  leftTop: {
    points: ['tl', 'tr'],
    overflow: autoAdjustOverflow,
  },
  leftBottom: {
    points: ['bl', 'br'],
    overflow: autoAdjustOverflow,
  }
};

export default placements;
