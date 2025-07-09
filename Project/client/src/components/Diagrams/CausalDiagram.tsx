import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ReactSVGPanZoom, TOOL_NONE } from 'react-svg-pan-zoom';

interface Variable {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  polarity?: string;
}

interface ModelData {
  variables: Variable[];
  connections: Connection[];
}

const CausalDiagram: React.FC = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState<ModelData | null>(null);
  const viewer = useRef<any>(null);

  useEffect(() => {
    fetch('http://localhost:5000/causal')
      .then(res => res.json())
      .then(data => {
        if (data[modelId as string]) {
          setModel(data[modelId as string]);
        }
      })
      .catch(error => console.error('Error fetching model:', error));
  }, [modelId]);

  if (!model) return <div className="p-6">Cargando modelo...</div>;

  const margin = 100;
  const allX = model.variables.map(v => v.x);
  const allY = model.variables.map(v => v.y);
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const width = maxX - minX;
  const height = maxY - minY;

  const variableMap: { [key: string]: Variable } = {};
  model.variables.forEach(v => (variableMap[v.id] = v));

  return (
    <div className="w-full h-[90vh] bg-gray-100 overflow-hidden">
      <ReactSVGPanZoom
        width={window.innerWidth}
        height={window.innerHeight * 0.9}
        ref={viewer}
        tool={TOOL_NONE}
        detectAutoPan={false}
        miniaturePosition="none"
        toolbarPosition="none"
        className="bg-white"
      >
        <svg width={width + margin * 2} height={height + margin * 2}>
          <g transform={`translate(${margin - minX}, ${margin - minY})`}>
            {/* Conexiones */}
            {model.connections.map(conn => {
              const from = variableMap[conn.from];
              const to = variableMap[conn.to];
              if (!from || !to) return null;

              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const angle = Math.atan2(dy, dx);
              const arrowLength = 10;
              const arrowAngle = Math.PI / 6;

              const arrowX = to.x - arrowLength * Math.cos(angle);
              const arrowY = to.y - arrowLength * Math.sin(angle);

              const arrowLeftX = arrowX - arrowLength * Math.cos(angle - arrowAngle);
              const arrowLeftY = arrowY - arrowLength * Math.sin(angle - arrowAngle);
              const arrowRightX = arrowX - arrowLength * Math.cos(angle + arrowAngle);
              const arrowRightY = arrowY - arrowLength * Math.sin(angle + arrowAngle);

              return (
                <g key={conn.id}>
                  <line
                    x1={from.x}
                    y1={from.y}
                    x2={to.x}
                    y2={to.y}
                    stroke="black"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points={`
                      ${to.x},${to.y}
                      ${arrowLeftX},${arrowLeftY}
                      ${arrowRightX},${arrowRightY}
                    `}
                    fill="black"
                  />
                </g>
              );
            })}

            {/* Variables */}
            {model.variables.map(variable => (
              <text
                key={variable.id}
                x={variable.x}
                y={variable.y}
                fontFamily="Times New Roman"
                fontSize="12"
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {variable.name}
              </text>
            ))}
          </g>
        </svg>
      </ReactSVGPanZoom>
    </div>
  );
};

export default CausalDiagram;
