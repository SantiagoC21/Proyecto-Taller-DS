import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react';
import { getMockModelById } from '../../utils/mockData';
import { Variable, Connection } from '../../types';

const CausalDiagram: React.FC = () => {
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
      // Auto-fit to screen
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
    const bbox = svg.getBBox();
    const containerWidth = svg.clientWidth;
    const containerHeight = svg.clientHeight;
    
    const scaleX = containerWidth / bbox.width;
    const scaleY = containerHeight / bbox.height;
    const scale = Math.min(scaleX, scaleY) * 0.8;
    
    setZoom(scale);
    setPan({
      x: (containerWidth - bbox.width * scale) / 2 - bbox.x * scale,
      y: (containerHeight - bbox.height * scale) / 2 - bbox.y * scale
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

  const getVariableColor = (type: Variable['type']) => {
    switch (type) {
      case 'stock': return '#3B82F6';
      case 'flow': return '#10B981';
      case 'auxiliary': return '#F59E0B';
      case 'constant': return '#6B7280';
      default: return '#8B5CF6';
    }
  };

  const renderArrow = (connection: Connection) => {
    if (!model) return null;
    
    const fromVar = model.variables.find(v => v.id === connection.from);
    const toVar = model.variables.find(v => v.id === connection.to);
    
    if (!fromVar || !toVar) return null;
    
    const dx = toVar.x - fromVar.x;
    const dy = toVar.y - fromVar.y;
    const angle = Math.atan2(dy, dx);
    const length = Math.sqrt(dx * dx + dy * dy);
    
    const startX = fromVar.x + Math.cos(angle) * 30;
    const startY = fromVar.y + Math.sin(angle) * 15;
    const endX = toVar.x - Math.cos(angle) * 30;
    const endY = toVar.y - Math.sin(angle) * 15;
    
    return (
      <g key={connection.id}>
        <line
          x1={startX}
          y1={startY}
          x2={endX}
          y2={endY}
          stroke={connection.polarity === 'positive' ? '#10B981' : '#EF4444'}
          strokeWidth="2"
          markerEnd="url(#arrowhead)"
        />
        <text
          x={startX + (endX - startX) / 2}
          y={startY + (endY - startY) / 2 - 5}
          textAnchor="middle"
          fontSize="12"
          fill={connection.polarity === 'positive' ? '#10B981' : '#EF4444'}
          fontWeight="bold"
        >
          {connection.polarity === 'positive' ? '+' : '-'}
        </text>
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
          <h2 className="text-lg font-medium text-gray-600">Diagrama Causal</h2>
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
            {model.connections.map(renderArrow)}
            
            {/* Variables */}
            {model.variables.map((variable) => (
              <g key={variable.id}>
                <circle
                  cx={variable.x}
                  cy={variable.y}
                  r="25"
                  fill={getVariableColor(variable.type)}
                  stroke="white"
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />
                <text
                  x={variable.x}
                  y={variable.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="10"
                  fill="white"
                  fontWeight="bold"
                >
                  {variable.name.split(' ')[0]}
                </text>
                <text
                  x={variable.x}
                  y={variable.y + 40}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#374151"
                  fontWeight="medium"
                >
                  {variable.name}
                </text>
              </g>
            ))}
          </g>
        </svg>
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

export default CausalDiagram;