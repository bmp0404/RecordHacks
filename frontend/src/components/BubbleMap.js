import React, { useRef, useEffect, useState } from 'react';
import Jam from './Jam';

export default function BubbleMap({ dynamicPages }) {
  return (
    <div className="bubble-map" style={{ position: 'relative' }}>
      {dynamicPages.map(p => (
        <Jam
          key={p.id}
          bubbleId={p.bubbleId}
          destination={p.path}
          label={p.title}
          color={p.color}
          size={p.size}
          x={p.x}
          y={p.y}
          highlight={p.highlight}
        />
      ))}
    </div>
  );
}
