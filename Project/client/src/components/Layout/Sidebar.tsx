import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  GitBranch, 
  Workflow, 
  Table, 
  BarChart3, 
  LogOut, 
  ChevronDown,
  ChevronRight,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMockModels } from '../../utils/mockData';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const models = getMockModels();

  const menuItems = [
    {
      id: 'causal',
      name: 'Diagrama Causal',
      icon: GitBranch,
      path: '/app/causal',
      hasDropdown: true
    },
    {
      id: 'forrester',
      name: 'Diagrama Forrester',
      icon: Workflow,
      path: '/app/forrester',
      hasDropdown: true
    },
    {
      id: 'tables',
      name: 'Tablas',
      icon: Table,
      path: '/app/tables',
      hasDropdown: false
    },
    {
      id: 'simulation',
      name: 'Simulación',
      icon: BarChart3,
      path: '/app/simulation',
      hasDropdown: false
    }
  ];

  const handleMenuClick = (item: typeof menuItems[0]) => {
    if (item.hasDropdown) {
      setExpandedMenus(prev => ({
        ...prev,
        [item.id]: !prev[item.id]
      }));
    } else {
      navigate(item.path);
    }
  };

  const handleModelClick = (path: string, modelId: string) => {
    navigate(`${path}/${modelId}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={onToggle} />
      )}

      {/* Sidebar */}
      <div className={`${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } fixed lg:relative lg:translate-x-0 inset-y-0 left-0 z-30 w-64 bg-white shadow-xl border-r border-gray-200 transition-transform duration-300 ease-in-out`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Menu</h2>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            <div key={item.id}>
              <button
                onClick={() => handleMenuClick(item)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.hasDropdown && (
                  expandedMenus[item.id] ? 
                    <ChevronDown className="h-4 w-4" /> : 
                    <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Dropdown */}
              {item.hasDropdown && expandedMenus[item.id] && (
                <div className="ml-8 mt-2 space-y-1 max-h-40 overflow-y-auto">
                  {models.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelClick(item.path, model.id)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {model.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Salir</span>
          </button>
        </div>
      </div>

      {/* Mobile menu button */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>
    </>
  );
};

export default Sidebar;