'use client'

import React, { useMemo, useState, UIEvent } from 'react'

interface BaseItem {
  id: string | number;
  text: string;
}

interface VirtualItemExtension {
  originalIndex: number;
  offsetTop: number;
}

interface VirtualItem<T> extends BaseItem, VirtualItemExtension {

  [key: string]: any; 
}

interface VirtualizedListProps<T extends BaseItem> {
  items: T[];
  itemHeight: number;
  windowHeight: number;
  buffer?: number;
}

interface RangeIndices {
  startIndex: number;
  endIndex: number;
}

const VirtualizedList = <T extends BaseItem,>({
  items,
  itemHeight,
  windowHeight,
  buffer = 2
}: VirtualizedListProps<T>) => {
  const [scrollTop, setScrollTop] = useState<number>(0)
  
  const totalHeight = items.length * itemHeight;

  const { startIndex, endIndex } = useMemo<RangeIndices>(() => {
    const start = Math.floor(scrollTop / itemHeight)
    const end = Math.ceil((scrollTop + windowHeight) / itemHeight)
    
    const bufferStart = Math.max(0, start - buffer);
    const bufferEnd = Math.min(items.length - 1, end + buffer)
    
    return { startIndex: bufferStart, endIndex: bufferEnd };
  }, [scrollTop, items.length, itemHeight, windowHeight, buffer]);

  const handleScroll = (e: UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }
  
  const visibleItems = useMemo<VirtualItem<T>[]>(() => {
    if (items.length === 0) return [];
    
    return items.slice(startIndex, endIndex + 1).map((item, index) => {
      const originalIndex = startIndex + index;
      return {
        ...item, 
        originalIndex,
        offsetTop: originalIndex * itemHeight
      }
    })
  }, [items, startIndex, endIndex, itemHeight])

  return (
    <div
      onScroll={handleScroll}
      style={{
        height: windowHeight,
        overflowY: 'auto',
        position: 'relative',
        border: '1px solid #ccc'
      }}
    >
      <div style={{ height: totalHeight, width: "100%", position: "relative" }}>
        {visibleItems.map((item) => (
          <div 
            key={item.id}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: itemHeight,
              transform: `translateY(${item.offsetTop}px)`,
            }}
          > 
            <div style={{ height: "100%", display: "flex", alignItems: "center", padding: "0 10px", borderBottom: "1px solid #eee" }}>
              Row #{item.originalIndex}: {item.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default VirtualizedList