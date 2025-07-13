/*
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ReactSVGPanZoom, TOOL_NONE, TOOL_AUTO, TOOL_ZOOM_IN, TOOL_ZOOM_OUT, Value, Tool } from 'react-svg-pan-zoom';
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';

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
  const [value, setValue] = useState<Value | null>(null);
  const [tool, setTool] = useState<Tool>(TOOL_NONE);

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

  const handleZoomIn = () => {
    if (viewer.current) {
      viewer.current.zoomOnViewerCenter(1.2);
    }
  };

  const handleZoomOut = () => {
    if (viewer.current) {
      viewer.current.zoomOnViewerCenter(0.8);
    }
  };

  const handleFitToViewer = () => {
    if (viewer.current) {
      viewer.current.fitToViewer();
    }
  };

  const handleAreaZoom = () => {
    setTool(TOOL_AUTO);
  };

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
    <div className="w-full h-[90vh] bg-gray-100 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleFitToViewer}
          className="p-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <button
          onClick={handleAreaZoom}
          className="p-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Área
        </button>
      </div>
      <ReactSVGPanZoom
        width={window.innerWidth}
        height={window.innerHeight * 0.9}
        ref={(ref) => {
          viewer.current = ref;
          if (ref && model && !value) {
            setTimeout(() => {
              ref.fitToViewer();
            }, 0);
          }
        }}
        value={value}
        onChangeValue={setValue}
        tool={tool}
        onChangeTool={setTool}
        detectAutoPan={false}
        className="bg-white"
      >
        <svg width={width + margin * 2} height={height + margin * 2}>
          <g transform={`translate(${margin - minX}, ${margin - minY})`}>
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

            {model.variables.map(variable => (
              <text
                key={variable.id}
                x={variable.x}
                y={variable.y}
                fontFamily="Times New Roman"
                fontSize="16"
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

*/

/*

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactSVGPanZoom,
  TOOL_NONE,
  TOOL_AUTO,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  Value,
  Tool
} from 'react-svg-pan-zoom';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

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
  color: string;       // Ej: "255-0-0" o "0-0-255"
  polarity: 'positive' | 'negative';
  x_curve: number;
  y_curve: number;
}

interface ModelData {
  variables: Variable[];
  connections: Connection[];
}

const CausalDiagram: React.FC = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState<ModelData | null>(null);
  const viewer = useRef<any>(null);
  const [value, setValue] = useState<Value | null>(null);
  const [tool, setTool] = useState<Tool>(TOOL_NONE);

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

  const handleZoomIn = () => {
    viewer.current?.zoomOnViewerCenter(1.2);
  };

  const handleZoomOut = () => {
    viewer.current?.zoomOnViewerCenter(0.8);
  };

  const handleFitToViewer = () => {
    viewer.current?.fitToViewer();
  };

  const handleAreaZoom = () => {
    setTool(TOOL_AUTO);
  };

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

  const variableMap: Record<string, Variable> = {};
  model.variables.forEach(v => (variableMap[v.id] = v));

  return (
    <div className="w-full h-[90vh] bg-gray-100 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={handleFitToViewer}
          className="p-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700"
        >
          <Maximize2 className="w-5 h-5" />
        </button>
        <button
          onClick={handleAreaZoom}
          className="p-2 bg-green-600 text-white rounded shadow hover:bg-green-700"
        >
          Área
        </button>
      </div>

      <ReactSVGPanZoom
        width={window.innerWidth}
        height={window.innerHeight * 0.9}
        ref={ref => {
          viewer.current = ref;
          if (ref && model && !value) {
            setTimeout(() => ref.fitToViewer(), 0);
          }
        }}
        value={value}
        onChangeValue={setValue}
        tool={tool}
        onChangeTool={setTool}
        detectAutoPan={false}
        className="bg-white"
      >
        <svg width={width + margin * 2} height={height + margin * 2}>
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>

          <g transform={`translate(${margin - minX}, ${margin - minY})`}>
            {model.connections.map(conn => {
              const from = variableMap[conn.from];
              const to = variableMap[conn.to];
              if (!from || !to) return null;

              // Definir la ruta curva con Q
              const d = `M ${from.x},${from.y} Q ${conn.x_curve},${conn.y_curve} ${to.x},${to.y}`;

              // Color según polaridad
              const strokeColor = conn.polarity === 'negative' ? 'red' : 'blue';
              const sign = conn.polarity === 'negative' ? '-' : '+';

              return (
                <g key={conn.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke={strokeColor}
                    strokeWidth={2}
                    markerEnd="url(#arrowhead)"
                  />

                  <text
                    x={to.x + 5}
                    y={to.y - 5}
                    fontSize={14}
                    fontWeight="bold"
                    fill={strokeColor}
                  >
                    {sign}
                  </text>
                </g>
              );
            })}

            {model.variables.map(variable => (
              <text
                key={variable.id}
                x={variable.x}
                y={variable.y}
                fontFamily="Times New Roman"
                fontSize={16}
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

*/



import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  ReactSVGPanZoom,
  TOOL_NONE,
  TOOL_AUTO,
  TOOL_ZOOM_IN,
  TOOL_ZOOM_OUT,
  Value,
  Tool
} from 'react-svg-pan-zoom';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

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
  color: string;       // Ej: "255-0-0" o "0-0-255"
  polarity: 'positive' | 'negative';
  x_curve: number;
  y_curve: number;
}

interface ModelData {
  variables: Variable[];
  connections: Connection[];
}

const CausalDiagram: React.FC = () => {
  const { modelId } = useParams();
  const [model, setModel] = useState<ModelData | null>(null);
  const viewer = useRef<any>(null);
  const [value, setValue] = useState<Value | null>(null);
  const [tool, setTool] = useState<Tool>(TOOL_NONE);

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

  const handleZoomIn = () => viewer.current?.zoomOnViewerCenter(1.2);
  const handleZoomOut = () => viewer.current?.zoomOnViewerCenter(0.8);
  const handleFitToViewer = () => viewer.current?.fitToViewer();
  const handleAreaZoom = () => setTool(TOOL_AUTO);

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

  const variableMap: Record<string, Variable> = {};
  model.variables.forEach(v => (variableMap[v.id] = v));

  // Ajuste de separación y tamaño de flecha
  const nodeRadius = 20;       // Radio de cada nodo para separar las flechas
  const arrowScale = 0.6;      // Escala para reducir el tamaño del marcador
  const strokeWidth = 1.5;     // Grosor de la línea

  return (
    <div className="w-full h-[90vh] bg-gray-100 overflow-hidden relative">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        {/* Controles de zoom */}
        <button onClick={handleZoomIn} className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
          <ZoomIn className="w-5 h-5" />
        </button>
        <button onClick={handleZoomOut} className="p-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600">
          <ZoomOut className="w-5 h-5" />
        </button>
        <button onClick={handleFitToViewer} className="p-2 bg-gray-600 text-white rounded shadow hover:bg-gray-700">
          <Maximize2 className="w-5 h-5" />
        </button>
        <button onClick={handleAreaZoom} className="p-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
          Área
        </button>
      </div>

      <ReactSVGPanZoom
        width={window.innerWidth}
        height={window.innerHeight * 0.9}
        ref={ref => {
          viewer.current = ref;
          if (ref && model && !value) setTimeout(() => ref.fitToViewer(), 0);
        }}
        value={value}
        onChangeValue={setValue}
        tool={tool}
        onChangeTool={setTool}
        detectAutoPan={false}
        className="bg-white"
      >
        <svg width={width + margin * 2} height={height + margin * 2}>
          <defs>
            <marker
              id="arrowhead"
              viewBox="0 0 10 10"
              refX={10 * arrowScale}
              refY={5 * arrowScale}
              markerWidth={6 * arrowScale}
              markerHeight={6 * arrowScale}
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="currentColor" />
            </marker>
          </defs>

          <g transform={`translate(${margin - minX}, ${margin - minY})`}>
            {model.connections.map(conn => {
              const from = variableMap[conn.from];
              const to = variableMap[conn.to];
              if (!from || !to) return null;

              // Calcular dirección y separar de los nodos
              const dx = to.x - from.x;
              const dy = to.y - from.y;
              const angle = Math.atan2(dy, dx);
              const startX = from.x + nodeRadius * Math.cos(angle);
              const startY = from.y + nodeRadius * Math.sin(angle);
              const endX = to.x - nodeRadius * Math.cos(angle);
              const endY = to.y - nodeRadius * Math.sin(angle);

              // Definir la ruta curva con Q usando puntos separados
              const d = `M ${startX},${startY} Q ${conn.x_curve},${conn.y_curve} ${endX},${endY}`;

              const color = conn.polarity === 'negative' ? 'red' : 'blue';
              const sign = conn.polarity === 'negative' ? '−' : '+';

              return (
                <g key={conn.id}>
                  <path
                    d={d}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x={endX + 5}
                    y={endY - 5}
                    fontSize={14}
                    fontWeight="bold"
                    fill={color}
                  >
                    {sign}
                  </text>
                </g>
              );
            })}

            {model.variables.map(variable => (
              <text
                key={variable.id}
                x={variable.x}
                y={variable.y}
                fontFamily="Times New Roman"
                fontSize={16}
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
