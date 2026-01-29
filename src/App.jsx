import React, { useState } from 'react';
import { 
  Layout, 
  Type, 
  MousePointer2, 
  Square, 
  Trash2, 
  Settings,
  Plus
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Helper for conditional classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function App() {
  const [components, setComponents] = useState([
    { id: 'root', type: 'container', props: { className: 'p-8 min-h-[400px] bg-white rounded-lg shadow-sm border border-dashed border-gray-200' }, children: [] }
  ]);
  const [selectedId, setSelectedId] = useState(null);

  // Helper to find a component by ID (flat search for this simple demo)
  const findComponent = (id) => {
    return components.find(c => c.id === id);
  };

  const updateComponent = (id, newProps) => {
    setComponents(prev => prev.map(c => 
      c.id === id ? { ...c, props: { ...c.props, ...newProps } } : c
    ));
  };

  const addComponent = (type) => {
    const newId = Math.random().toString(36).substr(2, 9);
    let newComponent = {
      id: newId,
      type,
      props: {},
      children: []
    };

    if (type === 'button') {
      newComponent.props = {
        children: 'New Button',
        className: 'px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors'
      };
    } else if (type === 'text') {
      newComponent.props = {
        children: 'Edit this text...',
        className: 'text-gray-800 text-base'
      };
    } else if (type === 'card') {
      newComponent.props = {
        children: 'Card Content',
        className: 'p-6 bg-white border border-gray-200 rounded-xl shadow-sm'
      };
    }

    setComponents([...components, newComponent]);
    setSelectedId(newId);
  };

  const deleteComponent = (id) => {
    if (id === 'root') return;
    setComponents(prev => prev.filter(c => c.id !== id));
    setSelectedId(null);
  };

  const renderComponent = (component) => {
    const isSelected = selectedId === component.id;
    
    // Base props wrapper to handle selection click
    const wrapperProps = {
      onClick: (e) => {
        e.stopPropagation();
        setSelectedId(component.id);
      },
      className: cn(
        component.props.className,
        "relative cursor-pointer transition-all",
        isSelected && "ring-2 ring-blue-500 ring-offset-2"
      ),
      style: component.props.style
    };

    if (component.type === 'container') {
      return (
        <div key={component.id} {...wrapperProps}>
          {components.filter(c => c.id !== 'root').map(c => (
             // In a real tree, these would be children of this node. 
             // For this flat demo, we'll just render them inside the root container only if this IS the root.
             // But wait, my state is flat list. I'll just render non-root items inside the root for now.
             null 
          ))}
          {/* Hack for flat list demo: if this is root, render all others inside */}
          {component.id === 'root' && components.filter(c => c.id !== 'root').map(renderComponent)}
        </div>
      );
    }

    if (component.type === 'button') {
      return (
        <button key={component.id} {...wrapperProps}>
          {component.props.children}
        </button>
      );
    }

    if (component.type === 'text') {
      return (
        <p key={component.id} {...wrapperProps}>
          {component.props.children}
        </p>
      );
    }

    if (component.type === 'card') {
      return (
        <div key={component.id} {...wrapperProps}>
          {component.props.children}
        </div>
      );
    }
  };

  const selectedComponent = findComponent(selectedId);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 overflow-hidden font-sans">
      
      {/* Left Sidebar - Palette */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Layout className="w-4 h-4" /> Components
          </h2>
        </div>
        <div className="p-4 space-y-3">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Basic</p>
          <button onClick={() => addComponent('button')} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all">
            <MousePointer2 className="w-4 h-4 text-blue-500" /> Button
          </button>
          <button onClick={() => addComponent('text')} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all">
            <Type className="w-4 h-4 text-green-500" /> Text Block
          </button>
          <button onClick={() => addComponent('card')} className="w-full flex items-center gap-3 p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-all">
            <Square className="w-4 h-4 text-purple-500" /> Card
          </button>
        </div>
      </div>

      {/* Center - Canvas */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <div className="h-14 border-b border-gray-200 bg-white flex items-center px-6 justify-between">
           <div className="flex items-center gap-2 text-sm text-gray-500">
             <span className="bg-gray-100 px-2 py-1 rounded">Page: Home</span>
             <span>/</span>
             <span>Canvas</span>
           </div>
           <button className="text-xs bg-black text-white px-3 py-1.5 rounded-md hover:bg-gray-800 transition-colors">Preview</button>
        </div>
        <div className="flex-1 overflow-auto p-8 bg-gray-50/50 flex justify-center">
          <div className="w-full max-w-3xl">
             {/* Render Root */}
             {renderComponent(findComponent('root'))}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-sm flex items-center gap-2">
            <Settings className="w-4 h-4" /> Properties
          </h2>
        </div>
        
        {selectedComponent ? (
          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">ID</label>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 block w-full">{selectedComponent.id}</code>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Content</label>
              <input 
                type="text" 
                value={selectedComponent.props.children || ''} 
                onChange={(e) => updateComponent(selectedComponent.id, { children: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Class Names (Tailwind)</label>
              <textarea 
                value={selectedComponent.props.className || ''} 
                onChange={(e) => updateComponent(selectedComponent.id, { className: e.target.value })}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2 font-mono h-24 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            {selectedComponent.id !== 'root' && (
              <div className="pt-4 border-t border-gray-100">
                <button 
                  onClick={() => deleteComponent(selectedComponent.id)}
                  className="w-full flex items-center justify-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete Component
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
            <MousePointer2 className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm">Select a component on the canvas to edit its properties.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
