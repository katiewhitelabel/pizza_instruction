import React, { useState, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { 
  Layout, 
  Square, 
  Trash2, 
  Settings, 
  MousePointer2,
  Move
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function App() {
  const [components, setComponents] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const canvasRef = useRef(null);

  const addCard = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newComponent = {
      id: newId,
      type: 'card',
      data: {
        x: 50,
        y: 50,
        width: 300,
        height: 200,
        className: 'bg-white shadow-md border border-gray-200 rounded-lg p-4 flex flex-col',
        content: 'Card Title\n\nAdd your content here.'
      }
    };
    setComponents([...components, newComponent]);
    setSelectedId(newId);
  };

  const updateComponent = (id, newData) => {
    setComponents(prev => prev.map(c => 
      c.id === id ? { ...c, data: { ...c.data, ...newData } } : c
    ));
  };

  const deleteComponent = (id) => {
    setComponents(prev => prev.filter(c => c.id !== id));
    setSelectedId(null);
  };

  const selectedComponent = components.find(c => c.id === selectedId);

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900 overflow-hidden font-sans select-none">
      
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col z-20 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Layout className="w-4 h-4" /> Toolbar
          </h2>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Add Elements</p>
          <button 
            onClick={addCard} 
            className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-white hover:shadow-md hover:border-gray-300 rounded-lg border border-gray-200 transition-all active:scale-95"
          >
            <Square className="w-5 h-5 text-blue-500" /> 
            <span>New Card</span>
          </button>
        </div>
      </div>

      {/* Center Canvas */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-gray-50">
        <div className="h-14 border-b border-gray-200 bg-white/80 backdrop-blur-sm flex items-center px-6 justify-between z-10">
           <div className="flex items-center gap-2 text-sm text-gray-500">
             <span className="font-medium text-gray-900">Canvas Board</span>
             <span className="text-gray-300">/</span>
             <span>Freeform</span>
           </div>
           <div className="text-xs text-gray-400">
             {components.length} items
           </div>
        </div>

        <div 
          ref={canvasRef}
          className="flex-1 relative overflow-hidden cursor-crosshair"
          onClick={() => setSelectedId(null)}
        >
          {components.map((component) => (
            <Rnd
              key={component.id}
              size={{ width: component.data.width, height: component.data.height }}
              position={{ x: component.data.x, y: component.data.y }}
              onDragStop={(e, d) => {
                updateComponent(component.id, { x: d.x, y: d.y });
              }}
              onResizeStop={(e, direction, ref, delta, position) => {
                updateComponent(component.id, {
                  width: ref.style.width,
                  height: ref.style.height,
                  ...position
                });
              }}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedId(component.id);
              }}
              bounds="parent"
              className={cn(
                "group relative transition-shadow",
                selectedId === component.id ? "ring-2 ring-blue-500 z-10" : "hover:ring-1 hover:ring-blue-300 z-0"
              )}
            >
              {/* Card Rendering */}
              <div className={cn("w-full h-full overflow-hidden", component.data.className)}>
                {/* Drag Handle (Visible on hover/select) */}
                <div className={cn(
                  "absolute top-0 left-0 right-0 h-6 bg-gray-100/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-move",
                  selectedId === component.id && "opacity-100"
                )}>
                  <Move className="w-3 h-3 text-gray-400" />
                </div>
                
                {/* Content */}
                <div className="pt-4 h-full">
                  <pre className="w-full h-full font-sans whitespace-pre-wrap text-sm text-gray-700 outline-none pointer-events-none">
                    {component.data.content}
                  </pre>
                </div>
              </div>
            </Rnd>
          ))}
          
          {components.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-300 pointer-events-none">
              <div className="text-center">
                <Square className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Canvas is empty</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col z-20 shadow-sm">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" /> Properties
          </h2>
        </div>
        
        {selectedComponent ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Layout</label>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-xs text-gray-400 block mb-1">X Position</span>
                  <input 
                    type="number"
                    value={Math.round(selectedComponent.data.x)}
                    onChange={(e) => updateComponent(selectedComponent.id, { x: parseInt(e.target.value) })}
                    className="w-full bg-transparent text-sm font-medium focus:outline-none"
                  />
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-xs text-gray-400 block mb-1">Y Position</span>
                  <input 
                    type="number"
                    value={Math.round(selectedComponent.data.y)}
                    onChange={(e) => updateComponent(selectedComponent.id, { y: parseInt(e.target.value) })}
                    className="w-full bg-transparent text-sm font-medium focus:outline-none"
                  />
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-xs text-gray-400 block mb-1">Width</span>
                  <input 
                    type="text"
                    value={selectedComponent.data.width}
                    readOnly
                    className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-500 cursor-not-allowed"
                  />
                </div>
                <div className="bg-gray-50 p-2 rounded border border-gray-200">
                  <span className="text-xs text-gray-400 block mb-1">Height</span>
                  <input 
                    type="text"
                    value={selectedComponent.data.height}
                    readOnly
                    className="w-full bg-transparent text-sm font-medium focus:outline-none text-gray-500 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content</label>
              <textarea 
                value={selectedComponent.data.content} 
                onChange={(e) => updateComponent(selectedComponent.id, { content: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-50"
                placeholder="Enter text..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Styles (Tailwind)</label>
              <textarea 
                value={selectedComponent.data.className} 
                onChange={(e) => updateComponent(selectedComponent.id, { className: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 font-mono h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-50 text-gray-600"
              />
            </div>

            <div className="pt-6 border-t border-gray-100">
              <button 
                onClick={() => deleteComponent(selectedComponent.id)}
                className="w-full flex items-center justify-center gap-2 text-white bg-red-500 hover:bg-red-600 px-4 py-2.5 rounded-lg text-sm font-medium transition-all shadow-sm active:transform active:scale-95"
              >
                <Trash2 className="w-4 h-4" /> Delete Card
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center bg-gray-50/50">
            <MousePointer2 className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-medium text-gray-500">No Selection</p>
            <p className="text-xs text-gray-400 mt-1">Select an item on the canvas to customize it.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
