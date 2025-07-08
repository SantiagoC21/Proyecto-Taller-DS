import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import { getMockModelById } from '../../utils/mockData';
import { Variable, Connection } from '../../types';

const ForresterDiagram: React.FC = () => {
  const { modelId } = useParams<{ modelId: string }>();
  const navigate = useNavigate();
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const model = modelId ? getMockModelById(modelId) : null;

  useEffect(() => {
    if (model) {
      fitToScreen();
    }
  }, [model]);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.1));
  };

  const fitToScreen = () => {
    if (!model || !svgRef.current) return;
    
    const svg = svgRef.current;
    const containerWidth = svg.clientWidth;
    const containerHeight = svg.clientHeight;
    
    const minX = Math.min(...model.variables.map(v => v.x));
    const maxX = Math.max(...model.variables.map(v => v.x));
    const minY = Math.min(...model.variables.map(v => v.y));
    const maxY = Math.max(...model.variables.map(v => v.y));
    
    const width = maxX - minX + 100;
    const height = maxY - minY + 100;
    
    const scaleX = containerWidth / width;
    const scaleY = containerHeight / height;
    const scale = Math.min(scaleX, scaleY) * 0.8;
    
    setZoom(scale);
    setPan({
      x: (containerWidth - width * scale) / 2 + (50 - minX) * scale,
      y: (containerHeight - height * scale) / 2 + (50 - minY) * scale
    });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setPan(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(3, prev * delta)));
  };

  const renderStock = (variable: Variable) => (
    <g key={variable.id}>
      <rect
        x={variable.x - 40}
        y={variable.y - 20}
        width="80"
        height="40"
        fill="#3B82F6"
        stroke="white"
        strokeWidth="2"
        rx="4"
        className="drop-shadow-sm"
      />
      <text
        x={variable.x}
        y={variable.y + 5}
        textAnchor="middle"
        fontSize="12"
        fill="white"
        fontWeight="bold"
      >
        {variable.name}
      </text>
    </g>
  );

  const renderFlow = (variable: Variable) => (
    <g key={variable.id}>
      <polygon
        points={`${variable.x-20},${variable.y-10} ${variable.x+20},${variable.y-10} ${variable.x+15},${variable.y+10} ${variable.x-15},${variable.y+10}`}
        fill="#10B981"
        stroke="white"
        strokeWidth="2"
        className="drop-shadow-sm"
      />
      <text
        x={variable.x}
        y={variable.y + 3}
        textAnchor="middle"
        fontSize="10"
        fill="white"
        fontWeight="bold"
      >
        {variable.name}
      </text>
    </g>
  );

  const renderAuxiliary = (variable: Variable) => (
    <g key={variable.id}>
      <circle
        cx={variable.x}
        cy={variable.y}
        r="20"
        fill="#F59E0B"
        stroke="white"
        strokeWidth="2"
        className="drop-shadow-sm"
      />
      <text
        x={variable.x}
        y={variable.y + 3}
        textAnchor="middle"
        fontSize="10"
        fill="white"
        fontWeight="bold"
      >
        {variable.name.split(' ')[0]}
      </text>
    </g>
  );

  const renderConstant = (variable: Variable) => (
    <g key={variable.id}>
      <rect
        x={variable.x - 15}
        y={variable.y - 8}
        width="30"
        height="16"
        fill="#6B7280"
        stroke="white"
        strokeWidth="2"
        rx="2"
        className="drop-shadow-sm"
      />
      <text
        x={variable.x}
        y={variable.y + 3}
        textAnchor="middle"
        fontSize="9"
        fill="white"
        fontWeight="bold"
      >
        {variable.name.split(' ')[0]}
      </text>
    </g>
  );

  const renderVariable = (variable: Variable) => {
    switch (variable.type) {
      case 'stock': return renderStock(variable);
      case 'flow': return renderFlow(variable);
      case 'auxiliary': return renderAuxiliary(variable);
      case 'constant': return renderConstant(variable);
      default: return renderAuxiliary(variable);
    }
  };

  const renderConnection = (connection: Connection) => {
    if (!model) return null;
    
    const fromVar = model.variables.find(v => v.id === connection.from);
    const toVar = model.variables.find(v => v.id === connection.to);
    
    if (!fromVar || !toVar) return null;
    
    const isFlowConnection = connection.type === 'flow';
    const strokeColor = isFlowConnection ? '#374151' : '#94A3B8';
    const strokeWidth = isFlowConnection ? 3 : 2;
    
    return (
      <g key={connection.id}>
        <line
          x1={fromVar.x}
          y1={fromVar.y}
          x2={toVar.x}
          y2={toVar.y}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={isFlowConnection ? '0' : '5,5'}
          markerEnd="url(#arrowhead)"
        />
      </g>
    );
  };

  if (!model) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Model not found</h2>
          <button
            onClick={() => navigate('/app')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div>
          <button
            onClick={() => navigate('/app')}
            className="text-xl font-semibold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer mb-1"
          >
            Sistema de Dinámica de Sistemas
          </button>
          <h2 className="text-lg font-medium text-gray-600">Diagrama Forrester</h2>
          <p className="text-sm text-gray-600">{model.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={fitToScreen}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Fit to Screen"
          >
            <Maximize2 className="h-5 w-5 text-gray-600" />
          </button>
          <button
            onClick={() => navigate('/app')}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Close"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Diagram */}
      <div className="flex-1 overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
        >
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#374151" />
            </marker>
          </defs>
          
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
            {/* Connections */}
            {model.connections.map(renderConnection)}
            
            {/* Variables */}
            {model.variables.map(renderVariable)}
          </g>
        </svg>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Legend</h3>
        <div className="space-y-2 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-600 rounded"></div>
            <span>Stock</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded"></div>
            <span>Flow</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-600 rounded-full"></div>
            <span>Auxiliary</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-600 rounded"></div>
            <span>Constant</span>
          </div>
        </div>
      </div>

      {/* Zoom indicator */}
      <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-lg shadow-lg border border-gray-200">
        <span className="text-sm font-medium text-gray-600">
          {Math.round(zoom * 100)}%
        </span>
      </div>
    </div>
  );
};

export default ForresterDiagram;