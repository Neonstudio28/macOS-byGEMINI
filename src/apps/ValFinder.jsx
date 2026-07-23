import React, { useState } from 'react';
import { useOS } from '../context/OSContext';
import { 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Code, 
  Trash2, 
  Plus, 
  Grid, 
  List, 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  HardDrive, 
  Download, 
  File,
  Eye,
  Tag
} from 'lucide-react';
import { sounds } from '../utils/soundEngine';

export const ValFinder = ({ windowData }) => {
  const { filesystem, findNodeById, createFSItem, deleteFSItem, openApp, emptyTrash } = useOS();
  const [currentFolderId, setCurrentFolderId] = useState(windowData?.currentFolderId || 'desktop');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const currentFolder = findNodeById(filesystem, currentFolderId) || findNodeById(filesystem, 'desktop');
  const children = currentFolder?.children || [];

  const handleItemDoubleClick = (item) => {
    sounds.playClick();
    if (item.type === 'folder') {
      setCurrentFolderId(item.id);
    } else {
      if (item.fileType === 'code') openApp('code', { fileContent: item.content, fileName: item.name });
      else if (item.fileType === 'text') openApp('notes', { noteContent: item.content, noteTitle: item.name });
      else if (item.fileType === 'image') openApp('photos', { imageUrl: item.url });
      else setPreviewItem(item);
    }
  };

  const filteredChildren = children.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex h-full w-full bg-[#1E1E1E] text-white/90 font-sans select-none text-xs">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/10 p-3 bg-[#252528]/80 backdrop-blur-md flex flex-col justify-between">
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-2">Favorites</span>
            {[
              { id: 'desktop', name: 'Desktop', icon: Folder },
              { id: 'documents', name: 'Documents', icon: Folder },
              { id: 'downloads', name: 'Downloads', icon: Download },
              { id: 'pictures', name: 'Pictures', icon: ImageIcon },
              { id: 'trash', name: 'Trash', icon: Trash2 }
            ].map(f => {
              const Icon = f.icon;
              const isActive = currentFolderId === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setCurrentFolderId(f.id)}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors font-medium ${
                    isActive ? 'bg-[#007AFF] text-white' : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  <Icon size={14} className={f.id === 'trash' ? 'text-rose-400' : 'text-sky-400'} />
                  <span className="truncate">{f.name}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/40 px-2">Tags</span>
            {['Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Purple'].map(tag => (
              <div key={tag} className="flex items-center gap-2 px-2 py-1 text-white/60 hover:text-white cursor-pointer">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  tag === 'Red' ? 'bg-red-500' : tag === 'Green' ? 'bg-green-500' : tag === 'Blue' ? 'bg-blue-500' : 'bg-purple-500'
                }`} />
                <span>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-[#1E1E1E]">
        {/* Toolbar */}
        <div className="h-10 px-3 border-b border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentFolderId('desktop')} className="p-1 hover:bg-white/10 rounded"><ArrowLeft size={14} /></button>
            <span className="font-bold text-xs text-white">{currentFolder.name}</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setViewMode('grid')} className={`p-1 rounded ${viewMode === 'grid' ? 'bg-white/20' : 'hover:bg-white/10'}`}><Grid size={14} /></button>
            <button onClick={() => setViewMode('list')} className={`p-1 rounded ${viewMode === 'list' ? 'bg-white/20' : 'hover:bg-white/10'}`}><List size={14} /></button>
            <button onClick={() => createFSItem(currentFolderId, 'New Folder', 'folder')} className="p-1 hover:bg-white/10 rounded" title="New Folder"><Plus size={14} /></button>
          </div>

          <div className="relative w-40">
            <Search size={12} className="absolute left-2.5 top-2 text-white/40" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-7 pr-2 py-1 rounded bg-white/10 text-xs text-white placeholder-white/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Files Grid/List Area */}
        <div className="flex-1 p-4 overflow-auto">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
              {filteredChildren.map(item => {
                const isSel = selectedItemId === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItemId(item.id)}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className={`flex flex-col items-center p-3 rounded-xl cursor-pointer transition-all border ${
                      isSel ? 'bg-[#007AFF]/30 border-[#007AFF] shadow-lg' : 'hover:bg-white/5 border-transparent'
                    }`}
                  >
                    <div className="mb-2">
                      {item.type === 'folder' ? (
                        <Folder size={40} className="text-sky-400 drop-shadow" />
                      ) : item.fileType === 'code' ? (
                        <Code size={40} className="text-blue-400 drop-shadow" />
                      ) : item.fileType === 'image' ? (
                        <ImageIcon size={40} className="text-emerald-400 drop-shadow" />
                      ) : (
                        <FileText size={40} className="text-amber-400 drop-shadow" />
                      )}
                    </div>
                    <span className="text-[11px] text-center text-white/90 truncate max-w-full font-medium">{item.name}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-white/40 pb-2">
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Type</th>
                  <th className="pb-2">Size</th>
                </tr>
              </thead>
              <tbody>
                {filteredChildren.map(item => (
                  <tr
                    key={item.id}
                    onDoubleClick={() => handleItemDoubleClick(item)}
                    className="hover:bg-white/10 cursor-pointer text-white/80"
                  >
                    <td className="py-2 flex items-center gap-2">
                      {item.type === 'folder' ? <Folder size={14} className="text-sky-400" /> : <FileText size={14} className="text-amber-400" />}
                      <span>{item.name}</span>
                    </td>
                    <td className="py-2 text-white/40">{item.type}</td>
                    <td className="py-2 text-white/40">--</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Path Bar */}
        <div className="h-6 px-3 bg-[#1C1C1E] border-t border-white/10 flex items-center text-[10px] text-white/40 font-mono">
          Users &gt; alex &gt; {currentFolder.name}
        </div>
      </div>
    </div>
  );
};
