import React, { useMemo, useState, useCallback, useRef, useEffect } from 'react';
import { scaleLinear, scalePoint } from '@visx/scale';
import { LinePath } from '@visx/shape';
import { Group } from '@visx/group';
import { curveCatmullRom } from '@visx/curve';
import { localPoint } from '@visx/event';
import { useSpringValue, animated } from '@react-spring/web';
import { svgPathProperties } from 'svg-path-properties';


const graphData = [
  { time: '01:00 PM', value: 88753.54 },
  { time: '01:03 PM', value: 88620.12 },
  { time: '01:06 PM', value: 88658.38 },
  { time: '01:09 PM', value: 88691.87 },
  { time: '01:12 PM', value: 88813.13 },
  { time: '01:15 PM', value: 88743.43 },
  { time: '01:18 PM', value: 88680.4 },
  { time: '01:21 PM', value: 88611.84 },
  { time: '01:24 PM', value: 88500.95 },
  { time: '01:27 PM', value: 88187.44 },
  { time: '01:30 PM', value: 88301.49 },
  { time: '01:33 PM', value: 88399.46 },
  { time: '01:36 PM', value: 88216.6 },
  { time: '01:39 PM', value: 88165.23 },
  { time: '01:42 PM', value: 88076.14 },
  { time: '01:45 PM', value: 87991.74 },
  { time: '01:48 PM', value: 87734.99 },
  { time: '01:51 PM', value: 87659.45 },
  { time: '01:54 PM', value: 87731.18 },
  { time: '01:57 PM', value: 88038.31 },
  { time: '02:00 PM', value: 88085.62 },
  { time: '02:03 PM', value: 88100.29 },
  { time: '02:06 PM', value: 88038.44 },
  { time: '02:09 PM', value: 87966.41 },
  { time: '02:12 PM', value: 88080.1 },
  { time: '02:15 PM', value: 88115.02 },
  { time: '02:18 PM', value: 88038.76 },
  { time: '02:21 PM', value: 87916.17 },
  { time: '02:24 PM', value: 87896.76 },
  { time: '02:27 PM', value: 87832.72 },
  { time: '02:30 PM', value: 87832.06 },
  { time: '02:33 PM', value: 87804.52 },
  { time: '02:36 PM', value: 87851.24 },
  { time: '02:39 PM', value: 87699.43 },
  { time: '02:42 PM', value: 87830.47 },
  { time: '02:45 PM', value: 88163.87 },
  { time: '02:48 PM', value: 88307.1 },
  { time: '02:51 PM', value: 88333.34 },
  { time: '02:54 PM', value: 88439.15 },
  { time: '02:57 PM', value: 88318.06 },
  { time: '03:00 PM', value: 88128.07 },
  { time: '03:03 PM', value: 88220.91 },
  { time: '03:06 PM', value: 88156.33 },
  { time: '03:09 PM', value: 87994.73 },
  { time: '03:12 PM', value: 87889.06 },
  { time: '03:15 PM', value: 87753.39 },
  { time: '03:18 PM', value: 87769.53 },
  { time: '03:21 PM', value: 87839.38 },
  { time: '03:24 PM', value: 87945.91 },
  { time: '03:27 PM', value: 88053.23 },
  { time: '03:30 PM', value: 88143.83 },
  { time: '03:33 PM', value: 88118.97 },
  { time: '03:36 PM', value: 88044.15 },
  { time: '03:39 PM', value: 87863.17 },
  { time: '03:42 PM', value: 87995.13 },
  { time: '03:45 PM', value: 87973.8 },
  { time: '03:48 PM', value: 87924.56 },
  { time: '03:51 PM', value: 88066.12 },
  { time: '03:54 PM', value: 87958.34 },
  { time: '03:57 PM', value: 88058.52 },
  { time: '04:00 PM', value: 88094.10 }
];

const width = 640;
const height = 400;
const margin = { top: 50, right: 110, bottom: 48, left: 40 };

const GlowLine = () => {
  const [hoverX, setHoverX] = useState<number>(0);
  const [clampedIndex, setClampedIndex] = useState<number>(0);
  const [glowPoints, setGlowPoints] = useState<{ x: number, y: number }[]>([]);
  const pathRef = useRef<SVGPathElement>(null);

  const xScale = useMemo(() =>
    scalePoint({
      domain: graphData.map(d => d.time),
      range: [margin.left, width - margin.right],
    }), []);

  const yScale = useMemo(() => {
    const max = Math.max(...graphData.map(d => d.value));
    const min = Math.min(...graphData.map(d => d.value));
    return scaleLinear({
      domain: [min, max],
      range: [height - margin.bottom, margin.top],
    });
  }, []);

  const maxVal = Math.max(...graphData.map(d => d.value));
  const minVal = Math.min(...graphData.map(d => d.value));
  const maxPoint = graphData.find(d => d.value === maxVal);
  const minPoint = graphData.find(d => d.value === minVal);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGRectElement>) => {
    const { x } = localPoint(event) || { x: 0 };
    setHoverX(x);
  }, []);

  useEffect(() => {
    const distances = graphData.map(d => Math.abs((xScale(d.time) ?? 0) - hoverX));
    const nearest = distances.indexOf(Math.min(...distances));
    setClampedIndex(nearest);
  }, [hoverX]);

  const clampedPoint = graphData[clampedIndex];
  const clampedX = xScale(clampedPoint.time) ?? 0;
  const clampedY = yScale(clampedPoint.value);

  const springX = useSpringValue(clampedX); // for denotation line
  const springY = useSpringValue(clampedY); // for tooltip
  const springGlowX = useSpringValue(clampedX, {
    config: { tension: 60, friction: 50 } // slower smoother movement for glow
  });

  useEffect(() => {
    springX.start(clampedX);
    springY.start(clampedY);
    springGlowX.start(clampedX); // animate glow slice separately
  }, [clampedX, clampedY]);

  useEffect(() => {
    let frameId: number;
  
    const updateGlow = () => {
      if (!pathRef.current) return;
      const path = pathRef.current;
      const properties = new svgPathProperties(path.getAttribute('d') || '');
      const totalLength = properties.getTotalLength();
  
      const xTarget = springGlowX.get();
      let low = 0;
      let high = totalLength;
      let centerLength = 0;
      const targetX = springX.get();
      
      for (let i = 0; i < 20; i++) {
        const mid = (low + high) / 2;
        const pt = path.getPointAtLength(mid);
        if (pt.x < targetX) {
          low = mid;
        } else {
          high = mid;
        }
        centerLength = mid;
      }
      
  
      const glowStart = Math.max(0, centerLength - 20);
      const glowEnd = Math.min(totalLength, centerLength + 20);
  
      const newPoints: { x: number; y: number }[] = [];
      for (let i = glowStart; i <= glowEnd; i += 2) {
        const pt = properties.getPointAtLength(i);
        newPoints.push({ x: pt.x, y: pt.y });
      }
  
      setGlowPoints(newPoints);
      frameId = requestAnimationFrame(updateGlow);
    };
  
    updateGlow();
    return () => cancelAnimationFrame(frameId);
  }, [springX]);
  

  return (
    <svg width={width} height={height} className="bg-[#0B0C0C] rounded-xl">
      <Group>

        {maxPoint && (
          <>
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={yScale(maxVal)}
              y2={yScale(maxVal)}
              stroke="#434343"
              strokeDasharray="4,4"
            />
            <text
              x={width - margin.right + 5}
              y={yScale(maxVal)}
              fill="#9E9E9E"
              fontSize={14}
              alignmentBaseline="middle"
              dx={6}
            >
              {maxVal}
            </text>
          </>
        )}

        {minPoint && (
          <>
            <line
              x1={margin.left}
              x2={width - margin.right}
              y1={yScale(minVal)}
              y2={yScale(minVal)}
              stroke="#434343"
              strokeDasharray="4,4"
            />
            <text
              x={width - margin.right + 5}
              y={yScale(minVal)}
              fill="#9E9E9E"
              fontSize={14}
              alignmentBaseline="middle"
              dx={6}
            >
              {minVal}
            </text>
          </>
        )}

        <LinePath
          innerRef={pathRef}
          curve={curveCatmullRom.alpha(0.3)}
          data={graphData}
          x={d => xScale(d.time) ?? 0}
          y={d => yScale(d.value)}
          stroke="#25221E"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />

        <animated.line
          x1={springX}
          x2={springX}
          y1={margin.top}
          y2={height - margin.bottom}
          stroke="#FDE7CC"
        />

        {glowPoints.length > 1 && (
          <path
            d={glowPoints.reduce(
              (acc, p, i) => acc + `${i === 0 ? 'M' : 'L'}${p.x},${p.y} `,
              ''
            )}
            stroke="#FDE0BD"
            strokeWidth={4}
            strokeLinecap="round"
            fill = "none"
            style={{
              filter: `
                drop-shadow(0 0 4px rgba(247, 147, 26, 0.9))
                drop-shadow(0 0 12px rgba(247, 147, 26, 0.7))
                drop-shadow(0 0 20px rgba(247, 147, 26, 0.6))`
            }}
          />
        )}

        <animated.g transform={springX.to(x => {
          const tooltipWidth = 172;
          const halfWidth = tooltipWidth / 2;
          const clampedX = Math.max(
            margin.left + halfWidth,
            Math.min(x, width - margin.right - halfWidth)
          );
          return `translate(${clampedX - halfWidth},${yScale(maxVal) - 50})`;
        })}>
          <rect
            width={172}
            height={32}
            rx={4}
            fill="#1A1B1B"
          />
          <text
            x={86}
            y={21}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontFamily="inter"
          >
            <tspan fill="#FDE7CC">{clampedPoint.value} </tspan>
            <tspan fill="#4C443D" dx={4}>•</tspan>
            <tspan fill="#FDE7CC" dx={4}> {clampedPoint.time}</tspan>
          </text>
        </animated.g>

        <rect
          width={width}
          height={height}
          fill="transparent"
          onMouseMove={handleMouseMove}
        />
      </Group>
    </svg>
  );
};

export default GlowLine;