import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wrench, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Database, 
  BookOpen, 
  ShieldCheck, 
  HardHat, 
  Layers, 
  ArrowUpRight, 
  ArrowDownLeft, 
  RefreshCw, 
  FileText, 
  Download, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Check, 
  X, 
  Cpu, 
  Server, 
  Code2, 
  Flame, 
  Droplet, 
  Zap, 
  Key, 
  Wind, 
  Paintbrush, 
  Hammer, 
  CheckCircle, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { MaintenanceRequest, MaintenanceStatus, MaintenanceType, MaintenanceInventoryItem, InventoryCategory } from '../../types';

export const MaintenanceDashboard: React.FC = () => {
  const { 
    currentUser, 
    maintenance, 
    updateMaintenanceStatus, 
    createMaintenanceRequest,
    assignMaintenanceTechnician,
    maintenanceInventory, 
    inventoryMovements, 
    addInventoryItem, 
    updateInventoryItem, 
    deleteInventoryItem, 
    restockInventoryItem, 
    consumeInventoryItem,
    properties,
    formatMoney,
    activeCurrency,
    setIsDatabaseModalOpen,
    showToast
  } = useApp();

  // Active Tab inside Maintenance Dashboard
  const [activeTab, setActiveTab] = useState<'tickets' | 'inventory' | 'manuals' | 'database'>('tickets');

  // Sub-tab inside Manuals
  const [manualView, setManualView] = useState<'operational' | 'technical'>('operational');

  // Filter & Search states for Tickets
  const [ticketSearch, setTicketSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Todos' | MaintenanceStatus>('Todos');
  const [priorityFilter, setPriorityFilter] = useState<string>('Todas');
  const [typeFilter, setTypeFilter] = useState<string>('Todos');

  // Filter & Search states for Inventory
  const [inventorySearch, setInventorySearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('Todas');
  const [stockStatusFilter, setStockStatusFilter] = useState<'Todos' | 'Bajo' | 'Optimo'>('Todos');

  // Modal States
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState<MaintenanceRequest | null>(null);
  const [showRestockModal, setShowRestockModal] = useState<MaintenanceInventoryItem | null>(null);
  const [showConsumeModal, setShowConsumeModal] = useState<MaintenanceInventoryItem | null>(null);
  const [showNewItemModal, setShowNewItemModal] = useState(false);

  // Form States for New Ticket
  const [newPropertyId, setNewPropertyId] = useState(properties[0]?.id || '');
  const [newType, setNewType] = useState<MaintenanceType>('Correctivo');
  const [newPriority, setNewPriority] = useState<'Alta' | 'Media' | 'Baja'>('Media');
  const [newDescription, setNewDescription] = useState('');
  const [newEstimatedCost, setNewEstimatedCost] = useState(40);

  // Form States for Updating Ticket
  const [updateStatus, setUpdateStatus] = useState<MaintenanceStatus>('En Proceso');
  const [updateNotes, setUpdateNotes] = useState('');
  const [updateTechnician, setUpdateTechnician] = useState(currentUser.name || 'Ing. David Orellana');
  const [updateCost, setUpdateCost] = useState<number>(0);
  const [selectedSupplyId, setSelectedSupplyId] = useState('');
  const [selectedSupplyQty, setSelectedSupplyQty] = useState(1);

  // Form States for Restock / Consume
  const [movementQty, setMovementQty] = useState(5);
  const [movementReason, setMovementReason] = useState('');

  // Form States for New Inventory Item
  const [newItemCode, setNewItemCode] = useState('');
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryCategory>('Plomería');
  const [newItemStock, setNewItemStock] = useState(10);
  const [newItemMinStock, setNewItemMinStock] = useState(4);
  const [newItemUnit, setNewItemUnit] = useState('Unidades');
  const [newItemCost, setNewItemCost] = useState(15);
  const [newItemLocation, setNewItemLocation] = useState('Bodega Central - Estante A1');
  const [newItemNotes, setNewItemNotes] = useState('');

  // KPIs
  const totalPending = maintenance.filter(m => m.status === 'Pendiente').length;
  const totalInProgress = maintenance.filter(m => m.status === 'En Proceso').length;
  const totalResolved = maintenance.filter(m => m.status === 'Reparado').length;
  const totalEmergency = maintenance.filter(m => m.priority === 'Alta' && m.status !== 'Reparado').length;
  
  const lowStockCount = maintenanceInventory.filter(i => i.stock <= i.minStock).length;
  const totalInventoryValueUSD = maintenanceInventory.reduce((acc, curr) => acc + (curr.stock * curr.unitCostUSD), 0);

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return maintenance.filter(t => {
      const matchSearch = 
        t.ticketNumber.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.propertyTitle.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.description.toLowerCase().includes(ticketSearch.toLowerCase()) ||
        t.requestedBy.toLowerCase().includes(ticketSearch.toLowerCase());
      
      const matchStatus = statusFilter === 'Todos' || t.status === statusFilter;
      const matchPriority = priorityFilter === 'Todas' || t.priority === priorityFilter;
      const matchType = typeFilter === 'Todos' || t.type === typeFilter;

      return matchSearch && matchStatus && matchPriority && matchType;
    });
  }, [maintenance, ticketSearch, statusFilter, priorityFilter, typeFilter]);

  // Filtered Inventory
  const filteredInventory = useMemo(() => {
    return maintenanceInventory.filter(item => {
      const matchSearch = 
        item.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(inventorySearch.toLowerCase()) ||
        item.location.toLowerCase().includes(inventorySearch.toLowerCase());

      const matchCat = categoryFilter === 'Todas' || item.category === categoryFilter;
      
      const isLow = item.stock <= item.minStock;
      const matchStock = stockStatusFilter === 'Todos' 
        ? true 
        : stockStatusFilter === 'Bajo' 
          ? isLow 
          : !isLow;

      return matchSearch && matchCat && matchStock;
    });
  }, [maintenanceInventory, inventorySearch, categoryFilter, stockStatusFilter]);

  // Handlers
  const handleCreateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const prop = properties.find(p => p.id === newPropertyId);
    if (!prop) return;

    createMaintenanceRequest({
      propertyId: prop.id,
      propertyTitle: prop.title,
      propertyAddress: prop.address,
      requestedBy: currentUser.name || 'Ing. David Orellana (Técnico)',
      requesterRole: 'admin',
      type: newType,
      priority: newPriority,
      description: newDescription,
      contractorName: currentUser.name,
      estimatedCost: newEstimatedCost,
      actualCost: 0
    });

    setShowNewTicketModal(false);
    setNewDescription('');
  };

  const handleOpenUpdateModal = (ticket: MaintenanceRequest) => {
    setShowUpdateModal(ticket);
    setUpdateStatus(ticket.status);
    setUpdateNotes(ticket.resolutionNotes || '');
    setUpdateTechnician(ticket.contractorName || currentUser.name || 'Ing. David Orellana');
    setUpdateCost(ticket.actualCost || ticket.estimatedCost || 0);
    setSelectedSupplyId('');
    setSelectedSupplyQty(1);
  };

  const handleUpdateTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showUpdateModal) return;

    // If supply consumption is included
    if (selectedSupplyId && selectedSupplyQty > 0) {
      consumeInventoryItem(
        selectedSupplyId, 
        selectedSupplyQty, 
        showUpdateModal.id, 
        `Material utilizado en ticket ${showUpdateModal.ticketNumber}`
      );
    }

    updateMaintenanceStatus(
      showUpdateModal.id,
      updateStatus,
      updateNotes,
      updateTechnician,
      updateCost
    );

    setShowUpdateModal(null);
  };

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showRestockModal || movementQty <= 0) return;
    restockInventoryItem(showRestockModal.id, movementQty, movementReason);
    setShowRestockModal(null);
    setMovementQty(5);
    setMovementReason('');
  };

  const handleConsumeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showConsumeModal || movementQty <= 0) return;
    const ok = consumeInventoryItem(showConsumeModal.id, movementQty, undefined, movementReason || 'Despacho directo de bodega');
    if (ok) {
      setShowConsumeModal(null);
      setMovementQty(1);
      setMovementReason('');
    }
  };

  const handleCreateNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = newItemCode || `INS-${newItemCategory.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    addInventoryItem({
      itemCode: code,
      name: newItemName,
      category: newItemCategory,
      stock: newItemStock,
      minStock: newItemMinStock,
      unit: newItemUnit,
      unitCostUSD: newItemCost,
      location: newItemLocation,
      notes: newItemNotes
    });
    setShowNewItemModal(false);
    setNewItemName('');
    setNewItemCode('');
    setNewItemNotes('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Plomería': return Droplet;
      case 'Electricidad': return Zap;
      case 'Cerrajería': return Key;
      case 'Climatización': return Wind;
      case 'Pintura': return Paintbrush;
      default: return Hammer;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in pb-16">
      
      {/* 1. Header Banner & Profile Identifier */}
      <div className="bg-[#1E3328] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#A3C7AD]/20 text-[#A3C7AD] border border-[#A3C7AD]/30 flex items-center gap-1.5">
                <HardHat className="w-3 h-3 text-[#A3C7AD]" />
                Área Técnica de Operaciones & DBA
              </span>
              <span className="text-[10px] text-white/50">·</span>
              <span className="text-[10px] text-white/70 font-mono">Terranova Facilities</span>
            </div>

            <h1 className="font-serif-brand text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Centro de Mantenimiento Técnico & Control de Insumos
            </h1>

            <p className="text-white/75 text-xs max-w-2xl leading-relaxed">
              Atención y diagnóstico de averías residenciales, despacho de suministros de bodega y mantenimiento de infraestructura técnica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowNewTicketModal(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Ticket Técnico</span>
            </button>

            <button
              onClick={() => setShowNewItemModal(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/20 flex items-center gap-2"
            >
              <Package className="w-4 h-4 text-[#A3C7AD]" />
              <span>Registrar Insumo</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Card 1: Pendientes */}
        <div className="bg-white rounded-2xl border border-[#D5E1D4] p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">Tickets Pendientes</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-gray-900">{totalPending}</span>
            {totalEmergency > 0 && (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded-md">
                {totalEmergency} Urgentes
              </span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 block">En cola de inspección</span>
        </div>

        {/* Card 2: En Proceso */}
        <div className="bg-white rounded-2xl border border-[#D5E1D4] p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">En Reparación</span>
            <Wrench className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-blue-900">{totalInProgress}</span>
            <span className="text-[10px] text-blue-700 font-semibold">Técnico activo</span>
          </div>
          <span className="text-[10px] text-gray-400 block">En curso en inmueble</span>
        </div>

        {/* Card 3: Resueltos */}
        <div className="bg-white rounded-2xl border border-[#D5E1D4] p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">Resueltos / Cerrados</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-900">{totalResolved}</span>
            <span className="text-[10px] text-emerald-700 font-semibold">Conforme</span>
          </div>
          <span className="text-[10px] text-gray-400 block">Inspección finalizada</span>
        </div>

        {/* Card 4: Insumos & Alerta Stock */}
        <div className="bg-white rounded-2xl border border-[#D5E1D4] p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">Insumos en Bodega</span>
            <Package className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-gray-900">{maintenanceInventory.length}</span>
            {lowStockCount > 0 ? (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <AlertTriangle className="w-3 h-3 text-amber-700" />
                {lowStockCount} Bajo Stock
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-emerald-700">Óptimo</span>
            )}
          </div>
          <span className="text-[10px] text-gray-400 block">Catálogo de suministros</span>
        </div>

        {/* Card 5: Valor del Stock */}
        <div className="col-span-2 lg:col-span-1 bg-white rounded-2xl border border-[#D5E1D4] p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-gray-500 text-xs">
            <span className="font-medium">Valor Stock Bodega</span>
            <DollarSign className="w-4 h-4 text-[#2D4539]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-lg font-bold font-mono text-[#1E3328]">
              {formatMoney(totalInventoryValueUSD)}
            </span>
          </div>
          <span className="text-[10px] text-gray-400 block">Moneda activa: {activeCurrency}</span>
        </div>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#D5E1D4] pb-2 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('tickets')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'tickets'
              ? 'bg-[#2D4539] text-white shadow-xs'
              : 'bg-white border border-[#CBD8CA] text-gray-700 hover:bg-[#EEF5ED]'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Tickets de Mantenimiento</span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
            activeTab === 'tickets' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'
          }`}>
            {maintenance.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'bg-[#2D4539] text-white shadow-xs'
              : 'bg-white border border-[#CBD8CA] text-gray-700 hover:bg-[#EEF5ED]'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventario de Insumos & Repuestos</span>
          {lowStockCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500 text-white font-bold">
              {lowStockCount} alertas
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('manuals')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'manuals'
              ? 'bg-[#2D4539] text-white shadow-xs'
              : 'bg-white border border-[#CBD8CA] text-gray-700 hover:bg-[#EEF5ED]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Manuales de Uso & Manual Técnico</span>
        </button>

        {/* Dedicated Space for SQL Database */}
        <button
          onClick={() => setActiveTab('database')}
          className={`px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'database'
              ? 'bg-indigo-800 text-white shadow-xs'
              : 'bg-white border border-indigo-200 text-indigo-900 hover:bg-indigo-50'
          }`}
        >
          <Database className="w-4 h-4 text-indigo-600" />
          <span>Servicios de Base de Datos & SQL</span>
          <span className="text-[9px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-full font-mono font-bold">
            DBA
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: TICKETS DE MANTENIMIENTO */}
      {/* ========================================================= */}
      {activeTab === 'tickets' && (
        <div className="space-y-4 animate-in fade-in">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-[#D5E1D4] p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={ticketSearch}
                  onChange={(e) => setTicketSearch(e.target.value)}
                  placeholder="Buscar por código (MNT-...), propiedad, descripción o solicitante..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl text-xs focus:ring-2 focus:ring-[#2D4539] focus:outline-hidden"
                />
              </div>

              {/* Status Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
                {(['Todos', 'Pendiente', 'En Proceso', 'Reparado', 'Cancelado'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                      statusFilter === st
                        ? 'bg-[#2D4539] text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-filters (Priority & Type) */}
            <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-gray-100 text-xs">
              <span className="text-gray-500 font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filtros:
              </span>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-white border border-[#CBD8CA] rounded-lg px-2 py-1 text-xs text-gray-700"
              >
                <option value="Todas">Todas las Prioridades</option>
                <option value="Alta">Alta / Urgente</option>
                <option value="Media">Media</option>
                <option value="Baja">Baja</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-white border border-[#CBD8CA] rounded-lg px-2 py-1 text-xs text-gray-700"
              >
                <option value="Todos">Todos los Tipos</option>
                <option value="Correctivo">Correctivo (Reparación)</option>
                <option value="Preventivo">Preventivo (Programado)</option>
                <option value="Emergencia">Emergencia</option>
              </select>

              {(ticketSearch || statusFilter !== 'Todos' || priorityFilter !== 'Todas' || typeFilter !== 'Todos') && (
                <button
                  onClick={() => {
                    setTicketSearch('');
                    setStatusFilter('Todos');
                    setPriorityFilter('Todas');
                    setTypeFilter('Todos');
                  }}
                  className="text-gray-500 hover:text-gray-800 text-[11px] underline"
                >
                  Restablecer Filtros
                </button>
              )}
            </div>
          </div>

          {/* Ticket List Cards */}
          {filteredTickets.length === 0 ? (
            <div className="bg-white rounded-3xl border border-[#D5E1D4] p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 mx-auto flex items-center justify-center">
                <Wrench className="w-6 h-6" />
              </div>
              <h4 className="font-serif-brand text-base font-bold text-gray-800">
                No se encontraron tickets con los filtros seleccionados
              </h4>
              <p className="text-gray-500 text-xs max-w-md mx-auto">
                Prueba cambiando los términos de búsqueda o genera un nuevo ticket de mantenimiento.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTickets.map(ticket => {
                const isEmergency = ticket.priority === 'Alta' || ticket.type === 'Emergencia';
                return (
                  <div
                    key={ticket.id}
                    className={`bg-white rounded-3xl border p-5 shadow-2xs space-y-4 transition-all hover:shadow-md ${
                      ticket.status === 'Reparado'
                        ? 'border-emerald-200 bg-emerald-50/10'
                        : isEmergency
                          ? 'border-rose-300 ring-1 ring-rose-300'
                          : 'border-[#D5E1D4]'
                    }`}
                  >
                    {/* Header info */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-xs text-gray-900 bg-gray-100 px-2 py-0.5 rounded-lg border border-gray-200">
                            {ticket.ticketNumber}
                          </span>
                          
                          {/* Priority Badge */}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            ticket.priority === 'Alta'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : ticket.priority === 'Media'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-700'
                          }`}>
                            Prioridad {ticket.priority}
                          </span>

                          <span className="text-[10px] font-medium text-gray-500 bg-gray-50 px-2 py-0.5 rounded">
                            {ticket.type}
                          </span>
                        </div>

                        <h4 className="font-bold text-sm text-gray-900 line-clamp-1">
                          {ticket.propertyTitle}
                        </h4>
                        <p className="text-[11px] text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span className="truncate">{ticket.propertyAddress}</span>
                        </p>
                      </div>

                      {/* Status badge */}
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                        ticket.status === 'Reparado'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : ticket.status === 'En Proceso'
                            ? 'bg-blue-100 text-blue-800 border border-blue-300'
                            : ticket.status === 'Cancelado'
                              ? 'bg-gray-200 text-gray-700'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {ticket.status}
                      </span>
                    </div>

                    {/* Description */}
                    <div className="p-3 bg-[#FAFBF9] rounded-xl border border-gray-100 text-xs text-gray-700 leading-relaxed">
                      <p className="line-clamp-3">{ticket.description}</p>
                    </div>

                    {/* Metadata & Technician */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] text-gray-600 border-t border-gray-100 pt-3">
                      <div>
                        <span className="text-gray-400 block text-[10px]">Reportado Por:</span>
                        <span className="font-semibold text-gray-800">{ticket.requestedBy}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Fecha Reporte:</span>
                        <span className="font-mono">{ticket.date}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Técnico / Responsable:</span>
                        <span className="font-semibold text-blue-900">{ticket.contractorName || 'Sin asignar'}</span>
                      </div>
                      <div>
                        <span className="text-gray-400 block text-[10px]">Costo Mano de Obra:</span>
                        <span className="font-mono font-bold text-gray-800">
                          {ticket.actualCost ? formatMoney(ticket.actualCost) : (ticket.estimatedCost ? `Est. ${formatMoney(ticket.estimatedCost)}` : 'Por cotizar')}
                        </span>
                      </div>
                    </div>

                    {/* Resolution notes if resolved */}
                    {ticket.resolutionNotes && (
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-950 space-y-0.5">
                        <span className="font-bold flex items-center gap-1 text-[10px] text-emerald-900">
                          <CheckCircle className="w-3 h-3 text-emerald-700" />
                          Diagnóstico & Cierre Técnico:
                        </span>
                        <p>{ticket.resolutionNotes}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-1.5">
                        {ticket.status === 'Pendiente' && (
                          <button
                            onClick={() => {
                              assignMaintenanceTechnician(ticket.id, currentUser.name || 'Ing. David Orellana');
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-800 text-[11px] font-semibold transition-colors"
                          >
                            Asignarme a mí
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => handleOpenUpdateModal(ticket)}
                        className="px-3 py-1.5 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Wrench className="w-3.5 h-3.5 text-[#A3C7AD]" />
                        <span>Actualizar Reparación</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: INVENTARIO DE INSUMOS & REPUESTOS */}
      {/* ========================================================= */}
      {activeTab === 'inventory' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Controls Bar */}
          <div className="bg-white rounded-2xl border border-[#D5E1D4] p-4 shadow-2xs space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inventorySearch}
                  onChange={(e) => setInventorySearch(e.target.value)}
                  placeholder="Buscar insumo por nombre, código (INS-...) o ubicación en bodega..."
                  className="w-full pl-9 pr-4 py-2 bg-[#FAFBF9] border border-[#CBD8CA] rounded-xl text-xs focus:ring-2 focus:ring-[#2D4539] focus:outline-hidden"
                />
              </div>

              {/* Add item button */}
              <button
                onClick={() => setShowNewItemModal(true)}
                className="px-4 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Nuevo Insumo</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-xs pb-1 sm:pb-0">
              {['Todas', 'Plomería', 'Electricidad', 'Cerrajería', 'Climatización', 'Pintura', 'Herramientas', 'General'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                    categoryFilter === cat
                      ? 'bg-[#2D4539] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}

              <div className="border-l border-gray-300 pl-2 flex items-center gap-1.5">
                <button
                  onClick={() => setStockStatusFilter('Todos')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    stockStatusFilter === 'Todos' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setStockStatusFilter('Bajo')}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 ${
                    stockStatusFilter === 'Bajo' ? 'bg-amber-600 text-white' : 'text-amber-800 hover:bg-amber-50'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  Bajo Stock ({lowStockCount})
                </button>
              </div>
            </div>
          </div>

          {/* Low Stock Warning Banner if applicable */}
          {lowStockCount > 0 && stockStatusFilter !== 'Bajo' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Hay <strong>{lowStockCount} insumo(s)</strong> por debajo del nivel mínimo de seguridad en bodega. Se sugiere solicitar reposición.
                </span>
              </div>
              <button
                onClick={() => setStockStatusFilter('Bajo')}
                className="px-3 py-1 rounded-lg bg-amber-200 hover:bg-amber-300 text-amber-900 font-bold text-[11px] transition-colors"
              >
                Ver Críticos
              </button>
            </div>
          )}

          {/* Inventory Table */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 bg-[#FAFBF9] text-gray-500 font-semibold">
                    <th className="p-3.5">Código / Insumo</th>
                    <th className="p-3.5">Categoría</th>
                    <th className="p-3.5">Ubicación Bodega</th>
                    <th className="p-3.5 text-center">Stock Actual</th>
                    <th className="p-3.5">Costo Unit.</th>
                    <th className="p-3.5">Valor Total</th>
                    <th className="p-3.5 text-right">Operaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredInventory.map(item => {
                    const isLow = item.stock <= item.minStock;
                    const isOut = item.stock === 0;
                    const CatIcon = getCategoryIcon(item.category);

                    return (
                      <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                        {/* Name & Code */}
                        <td className="p-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200">
                              <CatIcon className="w-4 h-4 text-[#2D4539]" />
                            </div>
                            <div>
                              <span className="font-bold text-gray-900 block">{item.name}</span>
                              <span className="font-mono text-[10px] text-gray-400">{item.itemCode}</span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-[10px] font-semibold">
                            {item.category}
                          </span>
                        </td>

                        {/* Location */}
                        <td className="p-3.5 text-gray-600 font-medium">
                          {item.location}
                        </td>

                        {/* Stock visual */}
                        <td className="p-3.5 text-center">
                          <div className="inline-flex flex-col items-center">
                            <span className={`font-mono font-bold text-sm ${
                              isOut ? 'text-rose-600' : isLow ? 'text-amber-700' : 'text-emerald-800'
                            }`}>
                              {item.stock} <span className="text-[10px] font-normal text-gray-500">{item.unit}</span>
                            </span>
                            <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                              isOut 
                                ? 'bg-rose-100 text-rose-800' 
                                : isLow 
                                  ? 'bg-amber-100 text-amber-800' 
                                  : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {isOut ? 'Agotado' : isLow ? `Bajo (Mín: ${item.minStock})` : 'Óptimo'}
                            </span>
                          </div>
                        </td>

                        {/* Cost */}
                        <td className="p-3.5 font-mono text-gray-800 font-semibold">
                          {formatMoney(item.unitCostUSD)}
                        </td>

                        {/* Total Value */}
                        <td className="p-3.5 font-mono font-bold text-[#1E3328]">
                          {formatMoney(item.stock * item.unitCostUSD)}
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                setShowRestockModal(item);
                                setMovementQty(5);
                                setMovementReason('Reabastecimiento regular');
                              }}
                              className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-200 transition-colors"
                              title="Ingresar Entrada de Stock (+)"
                            >
                              + Entrada
                            </button>

                            <button
                              onClick={() => {
                                setShowConsumeModal(item);
                                setMovementQty(1);
                                setMovementReason('Despacho para reparación');
                              }}
                              disabled={item.stock === 0}
                              className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] border border-amber-200 transition-colors disabled:opacity-40"
                              title="Registrar Salida de Insumo (-)"
                            >
                              - Salida
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Inventory Movement History (Kardex) */}
          <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h4 className="font-serif-brand text-base font-bold text-gray-900">
                  Historial de Movimientos de Bodega (Kardex Técnico)
                </h4>
                <p className="text-gray-500 text-xs">
                  Registro de entradas por reabastecimiento y salidas vinculadas a tickets de reparación
                </p>
              </div>
              <span className="text-xs font-mono font-semibold text-gray-500">
                {inventoryMovements.length} Registros
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {inventoryMovements.slice(0, 10).map(mov => (
                <div 
                  key={mov.id} 
                  className="p-3 rounded-xl bg-[#FAFBF9] border border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                      mov.type === 'Entrada' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {mov.type === 'Entrada' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{mov.itemName}</span>
                        <span className="font-mono text-[10px] text-gray-400">({mov.itemCode})</span>
                        {mov.ticketNumber && (
                          <span className="px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-mono text-[9px] font-bold">
                            Ticket #{mov.ticketNumber}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500">{mov.reason}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <span className={`font-mono font-bold ${
                      mov.type === 'Entrada' ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      {mov.type === 'Entrada' ? `+${mov.quantity}` : `-${mov.quantity}`}
                    </span>
                    <span className="text-gray-400 font-mono text-[10px]">{mov.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: MANUALES DE USO Y MANUAL TÉCNICO */}
      {/* ========================================================= */}
      {activeTab === 'manuals' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Sub-navigation between Operational vs Technical manual */}
          <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-[#D5E1D4] shadow-2xs max-w-md">
            <button
              onClick={() => setManualView('operational')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                manualView === 'operational'
                  ? 'bg-[#2D4539] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HardHat className="w-3.5 h-3.5" />
              <span>Manual de Operaciones & Mantenimiento</span>
            </button>
            <button
              onClick={() => setManualView('technical')}
              className={`flex-1 py-2 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                manualView === 'technical'
                  ? 'bg-[#2D4539] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Manual Técnico de Sistemas & DB</span>
            </button>
          </div>

          {/* VIEW A: MANUAL OPERATIVO DE MANTENIMIENTO */}
          {manualView === 'operational' && (
            <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 sm:p-8 shadow-2xs space-y-6 text-xs text-gray-700 leading-relaxed">
              <div className="border-b border-gray-200 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                  Manual de Procedimientos y Normativa Operacional
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-1">
                  Protocolo Oficial de Atención de Averías y Mantenimiento de Inmuebles
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  Guía para técnicos de planta y contratistas autorizados de Terranova Gestión Inmobiliaria.
                </p>
              </div>

              {/* Protocolo 1: SLAs */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">1</span>
                  <span>Clasificación de Prioridades y Tiempos de Respuesta (SLA)</span>
                </h4>
                <div className="pl-8 space-y-2 text-gray-600">
                  <p>
                    • <strong>Emergencia / Prioridad Alta (SLA &lt; 2 horas):</strong> Fugas masivas de agua potable, colapso de drenajes sanitarios, cortocircuitos con conato de incendio o cerraduras exteriores trabadas que impiden el acceso seguro. Requiere movilización inmediata.
                  </p>
                  <p>
                    • <strong>Prioridad Media (SLA &lt; 24 a 48 horas):</strong> Goteos en grifos, fallas en unidades de aire acondicionado split, problemas en calentadores de agua o puertas interiores desajustadas.
                  </p>
                  <p>
                    • <strong>Prioridad Baja / Preventivo (Programado):</strong> Pintura de resane, lubricación de portones eléctricos, limpieza semestral de canaletas pluviales e inspección de cubiertas de techo.
                  </p>
                </div>
              </div>

              {/* Protocolo 2: Diagnóstico y Consumo */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">2</span>
                  <span>Diagnóstico Técnico y Vinculación de Insumos de Bodega</span>
                </h4>
                <div className="pl-8 space-y-2 text-gray-600">
                  <p>
                    • Al acudir a la propiedad, el técnico debe realizar la inspección visual y diagnosticar el repuesto requerido.
                  </p>
                  <p>
                    • Todo insumo utilizado (válvulas, disyuntores, empaques, rollos de teflón) <strong>debe ser descontado del inventario</strong> mediante el botón "Actualizar Reparación", vinculando el consumo al número de ticket correspondiente para mantener la conciliación del Kardex de bodega.
                  </p>
                </div>
              </div>

              {/* Protocolo 3: Seguridad y Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-mono text-xs flex items-center justify-center font-bold">3</span>
                  <span>Normas de Seguridad Ocupacional y Checklist de Cierre</span>
                </h4>
                <div className="pl-8 space-y-2 text-gray-600">
                  <p>
                    • En trabajos eléctricos es obligatorio bajar el breaker principal de la caja de control y comprobar ausencia de tensión con multímetro antes de intervenir.
                  </p>
                  <p>
                    • En trabajos de fontanería se debe cerrar la llave de paso de la acometida exterior y purgar la línea residual.
                  </p>
                  <p>
                    • Antes de marcar un ticket como <strong>"Reparado"</strong>, el técnico debe solicitar la conformidad visual del inquilino u ocupante y redactar las notas de diagnóstico finales.
                  </p>
                </div>
              </div>

              {/* Protocolo 4: No Comercial */}
              <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200 text-indigo-950 space-y-1">
                <span className="font-bold flex items-center gap-1.5 text-xs text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-700" />
                  Aislamiento de Funciones Comerciales:
                </span>
                <p className="text-[11px] text-indigo-900/90 leading-relaxed">
                  El personal técnico no interviene ni tiene acceso a contratos de compraventa, comisiones comerciales ni márgenes de propietarios. La labor técnica se circunscribe a la salvaguarda y operatividad física de los inmuebles.
                </p>
              </div>
            </div>
          )}

          {/* VIEW B: MANUAL TÉCNICO DE SISTEMAS & ARQUITECTURA */}
          {manualView === 'technical' && (
            <div className="bg-white rounded-3xl border border-[#D5E1D4] p-6 sm:p-8 shadow-2xs space-y-6 text-xs text-gray-700 leading-relaxed">
              <div className="border-b border-gray-200 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-800">
                  Arquitectura de Software & Especificación de Base de Datos
                </span>
                <h3 className="font-serif-brand text-xl font-bold text-gray-900 mt-1">
                  Manual Técnico del Sistema · Infraestructura Relacional Terranova
                </h3>
                <p className="text-gray-500 text-xs mt-1">
                  Documentación para desarrolladores, DBAs y administradores de sistemas.
                </p>
              </div>

              {/* Especificación 1 */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-mono text-xs flex items-center justify-center font-bold">1</span>
                  <span>Arquitectura de la Aplicación y Stack Tecnológico</span>
                </h4>
                <div className="pl-8 space-y-2 text-gray-600">
                  <p>
                    • <strong>Frontend:</strong> React 19 + TypeScript con empaquetador Vite y estilos utilitarios con Tailwind CSS.
                  </p>
                  <p>
                    • <strong>Gestión de Estado:</strong> React Context API (<code>AppContext.tsx</code>) con capa de persistencia sincronizada en almacenamiento estructurado y tolerante a sesiones.
                  </p>
                  <p>
                    • <strong>Segregación RBAC:</strong> Modelo de Control de Acceso Basado en Roles estricto (Admin, Agente, Inquilino, Propietario, Contratista, Técnico DBA, Cliente y Visitante).
                  </p>
                </div>
              </div>

              {/* Especificación 2 */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-mono text-xs flex items-center justify-center font-bold">2</span>
                  <span>Esquema Relacional y Diccionario de Datos (12 Tablas)</span>
                </h4>
                <div className="pl-8 space-y-2 text-gray-600">
                  <p>
                    El script oficial <code>database_schema.sql</code> define las siguientes tablas relacionales con integridad referencial (claves foráneas en cascada controlada):
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] pt-1">
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>1. users</strong> (Credenciales, rol, teléfono, estado)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>2. properties</strong> (Inmuebles, tipología, geolocalización)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>3. lease_contracts</strong> (Contratos, plazos, prima, cuotas)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>4. contract_templates</strong> (Plantillas Word y PDF)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>5. payment_transactions</strong> (Recibos, RTN, conciliación)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>6. maintenance_requests</strong> (Tickets de avería, estado)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>7. maintenance_inventory</strong> (Catálogo de insumos técnicos)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>8. inventory_movements</strong> (Kardex de entradas y salidas)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>9. employees & payroll_records</strong> (Liquidación de nómina)
                    </div>
                    <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-200">
                      <strong>10. system_audit_logs</strong> (Auditoría inmutable)
                    </div>
                  </div>
                </div>
              </div>

              {/* Especificación 3 */}
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-800 font-mono text-xs flex items-center justify-center font-bold">3</span>
                  <span>Puesta en Marcha Local en MySQL / PostgreSQL</span>
                </h4>
                <div className="pl-8 space-y-2 text-gray-600">
                  <p>
                    • <strong>Instalación en MySQL (XAMPP / WAMP):</strong> Abre phpMyAdmin, crea la base <code>terranova_db</code> con cotejamiento <code>utf8mb4_unicode_ci</code> e importa el archivo descargable desde la pestaña de Base de Datos.
                  </p>
                  <p>
                    • <strong>Instalación en PostgreSQL (pgAdmin):</strong> Ejecuta el DDL relacional compatible con tipos <code>VARCHAR</code>, <code>NUMERIC(14,2)</code> y <code>BOOLEAN</code>.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: ESPACIO ESPECÍFICO: SERVICIOS DE BASE DE DATOS & SQL */}
      {/* ========================================================= */}
      {activeTab === 'database' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* Header Card */}
          <div className="bg-white rounded-3xl border border-indigo-200 p-6 sm:p-8 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300">
                    Espacio Técnico Reservado
                  </span>
                  <span className="text-[10px] text-gray-400">·</span>
                  <span className="text-[10px] text-gray-500 font-mono">Infraestructura SQL</span>
                </div>
                <h3 className="font-serif-brand text-2xl font-bold text-gray-900">
                  Servicios de Base de Datos & Consola SQL
                </h3>
                <p className="text-gray-600 text-xs max-w-xl">
                  Acceso exclusivo para el Técnico de Sistemas y DBA. Este espacio resguarda la exportación del esquema DDL/DML, respaldos y monitoreo de tablas sin exposición en barras comerciales públicas.
                </p>
              </div>

              <button
                onClick={() => setIsDatabaseModalOpen(true)}
                className="px-5 py-3 rounded-2xl bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 shrink-0"
              >
                <Database className="w-4 h-4 text-indigo-200" />
                <span>Abrir Consola SQL & Exportador</span>
              </button>
            </div>
          </div>

          {/* Database Health & Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
              <span className="text-gray-400 text-[10px] block uppercase font-mono">users</span>
              <span className="text-xl font-bold font-mono text-gray-900">7</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">Cuentas RBAC</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
              <span className="text-gray-400 text-[10px] block uppercase font-mono">properties</span>
              <span className="text-xl font-bold font-mono text-gray-900">{properties.length}</span>
              <span className="text-[10px] text-emerald-700 block font-semibold">Catálogo</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
              <span className="text-gray-400 text-[10px] block uppercase font-mono">contracts</span>
              <span className="text-xl font-bold font-mono text-gray-900">4</span>
              <span className="text-[10px] text-blue-700 block font-semibold">Contratos</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
              <span className="text-gray-400 text-[10px] block uppercase font-mono">maintenance</span>
              <span className="text-xl font-bold font-mono text-gray-900">{maintenance.length}</span>
              <span className="text-[10px] text-amber-700 block font-semibold">Tickets</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
              <span className="text-gray-400 text-[10px] block uppercase font-mono">inventory</span>
              <span className="text-xl font-bold font-mono text-gray-900">{maintenanceInventory.length}</span>
              <span className="text-[10px] text-indigo-700 block font-semibold">Insumos</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200 text-center space-y-1">
              <span className="text-gray-400 text-[10px] block uppercase font-mono">kardex</span>
              <span className="text-xl font-bold font-mono text-gray-900">{inventoryMovements.length}</span>
              <span className="text-[10px] text-purple-700 block font-semibold">Movimientos</span>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="bg-[#FAFBF9] rounded-3xl border border-[#CBD8CA] p-6 space-y-4">
            <h4 className="font-serif-brand text-base font-bold text-gray-900">
              Operaciones de Mantenimiento de Datos & Respaldo
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Box 1 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-gray-900">Script SQL Local (DDL + DML)</h5>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    Archivo completo <code>database_schema.sql</code> listo para importar en motores MySQL 8.0, MariaDB o PostgreSQL.
                  </p>
                </div>
                <button
                  onClick={() => setIsDatabaseModalOpen(true)}
                  className="w-full py-2 px-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-900 font-bold transition-colors text-center"
                >
                  Ver y Descargar .SQL
                </button>
              </div>

              {/* Box 2 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Server className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-gray-900">Respaldo Integral en JSON</h5>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    Volcado estructurado en formato JSON con todas las colecciones para migración de datos o auditoría técnica.
                  </p>
                </div>
                <button
                  onClick={() => {
                    const data = {
                      properties,
                      maintenance,
                      inventory: maintenanceInventory,
                      movements: inventoryMovements,
                      exportedAt: new Date().toISOString()
                    };
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `backup_terranova_${new Date().toISOString().split('T')[0]}.json`;
                    a.click();
                    showToast('Respaldo JSON descargado con éxito');
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold transition-colors text-center"
                >
                  Descargar Respaldo JSON
                </button>
              </div>

              {/* Box 3 */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3 flex flex-col justify-between">
                <div className="space-y-1.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h5 className="font-bold text-gray-900">Segregación de Privilegios</h5>
                  <p className="text-gray-500 text-[11px] leading-relaxed">
                    Conforme al requerimiento, este acceso no está expuesto en las barras comerciales generales ni accesible para administradores inmobiliarios.
                  </p>
                </div>
                <div className="py-2 px-3 rounded-xl bg-gray-50 text-gray-600 font-semibold text-center text-[11px] border border-gray-200">
                  🔒 Exclusivo DBA Activo
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: NUEVO TICKET TÉCNICO */}
      {/* ========================================================= */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Wrench className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Nuevo Ticket de Mantenimiento</h3>
              </div>
              <button onClick={() => setShowNewTicketModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Propiedad Inmobiliaria</label>
                <select
                  value={newPropertyId}
                  onChange={(e) => setNewPropertyId(e.target.value)}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                >
                  {properties.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.code} - {p.title} ({p.address})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Tipo de Intervención</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                  >
                    <option value="Correctivo">Correctivo (Reparación)</option>
                    <option value="Preventivo">Preventivo (Programado)</option>
                    <option value="Emergencia">Emergencia Inmediata</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Prioridad</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                  >
                    <option value="Alta">Alta / Urgente</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Descripción de la Avería o Trabajo</label>
                <textarea
                  required
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detalla la avería, ubicación exacta en el inmueble, síntomas (ej. goteo continuo bajo lavamanos, breaker disparado)..."
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-[#2D4539] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Costo Estimado de Mano de Obra (USD)</label>
                <input
                  type="number"
                  min={0}
                  value={newEstimatedCost}
                  onChange={(e) => setNewEstimatedCost(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-bold text-xs transition-colors"
                >
                  Registrar Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: ACTUALIZAR REPARACIÓN & CONSUMO DE INSUMOS */}
      {/* ========================================================= */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs bg-white/20 px-2 py-0.5 rounded font-bold">
                    {showUpdateModal.ticketNumber}
                  </span>
                  <span className="text-xs text-white/80">· {showUpdateModal.propertyTitle}</span>
                </div>
                <h3 className="font-serif-brand text-base font-bold mt-1">Actualizar Estado & Diagnóstico</h3>
              </div>
              <button onClick={() => setShowUpdateModal(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTicketSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Estado de la Reparación</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value as any)}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-bold text-gray-800"
                >
                  <option value="Pendiente">Pendiente (En cola)</option>
                  <option value="En Proceso">En Proceso (Trabajando en el inmueble)</option>
                  <option value="Reparado">Reparado (Trabajo terminado y probado)</option>
                  <option value="Cancelado">Cancelado (No procedente o duplicado)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Técnico / Responsable Asignado</label>
                <input
                  type="text"
                  required
                  value={updateTechnician}
                  onChange={(e) => setUpdateTechnician(e.target.value)}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Costo Real de Mano de Obra (USD)</label>
                <input
                  type="number"
                  min={0}
                  value={updateCost}
                  onChange={(e) => setUpdateCost(Number(e.target.value))}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-xs"
                />
              </div>

              {/* Vincular Insumo de Bodega */}
              <div className="p-3 bg-indigo-50/60 rounded-2xl border border-indigo-200 space-y-2">
                <span className="font-bold text-[11px] text-indigo-950 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-indigo-700" />
                  Despachar Insumo de Bodega para esta Reparación (Opcional):
                </span>
                
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <select
                      value={selectedSupplyId}
                      onChange={(e) => setSelectedSupplyId(e.target.value)}
                      className="w-full bg-white border border-indigo-300 rounded-xl p-2 text-[11px] text-gray-800"
                    >
                      <option value="">-- Ningún insumo adicional --</option>
                      {maintenanceInventory.map(item => (
                        <option key={item.id} value={item.id} disabled={item.stock === 0}>
                          {item.itemCode}: {item.name} (Disp: {item.stock} {item.unit})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <input
                      type="number"
                      min={1}
                      disabled={!selectedSupplyId}
                      value={selectedSupplyQty}
                      onChange={(e) => setSelectedSupplyQty(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-white border border-indigo-300 rounded-xl p-2 text-[11px] font-mono text-center disabled:opacity-50"
                      placeholder="Cant."
                    />
                  </div>
                </div>
                {selectedSupplyId && (
                  <p className="text-[10px] text-indigo-800">
                    * Se descontará automáticamente de la bodega y quedará registrado en el historial del ticket.
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Diagnóstico & Notas de Resolución</label>
                <textarea
                  rows={3}
                  value={updateNotes}
                  onChange={(e) => setUpdateNotes(e.target.value)}
                  placeholder="Detalla las reparaciones efectuadas, pruebas de estanqueidad o comprobación de voltaje..."
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800 focus:ring-2 focus:ring-[#2D4539] focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold text-xs"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-bold text-xs transition-colors"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REABASTECER INVENTARIO (ENTRADA) */}
      {/* ========================================================= */}
      {showRestockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-emerald-800 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-200">Entrada a Bodega</span>
                <h3 className="font-serif-brand text-base font-bold">Reabastecer: {showRestockModal.name}</h3>
              </div>
              <button onClick={() => setShowRestockModal(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRestockSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Stock Actual:</span>
                  <span className="font-bold text-gray-900 font-mono text-base">{showRestockModal.stock} {showRestockModal.unit}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Costo Unitario:</span>
                  <span className="font-bold text-gray-900 font-mono">{formatMoney(showRestockModal.unitCostUSD)}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Cantidad a Ingresar ({showRestockModal.unit})</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={movementQty}
                  onChange={(e) => setMovementQty(Math.max(1, Number(e.target.value)))}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-base font-bold text-emerald-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Motivo / Proveedor / Factura</label>
                <input
                  type="text"
                  required
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  placeholder="Ej. Compra mayorista Ferretería El Sol Fac #4892"
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowRestockModal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  Confirmar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: CONSUMO / SALIDA DE INSUMO */}
      {/* ========================================================= */}
      {showConsumeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className="bg-amber-800 text-white p-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-200">Salida de Bodega</span>
                <h3 className="font-serif-brand text-base font-bold">Despachar: {showConsumeModal.name}</h3>
              </div>
              <button onClick={() => setShowConsumeModal(null)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConsumeSubmit} className="p-6 space-y-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-500 block text-[10px]">Stock Disponible:</span>
                  <span className="font-bold text-gray-900 font-mono text-base">{showConsumeModal.stock} {showConsumeModal.unit}</span>
                </div>
                <div>
                  <span className="text-gray-500 block text-[10px]">Ubicación:</span>
                  <span className="font-semibold text-gray-700">{showConsumeModal.location}</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Cantidad a Despachar ({showConsumeModal.unit})</label>
                <input
                  type="number"
                  min={1}
                  max={showConsumeModal.stock}
                  required
                  value={movementQty}
                  onChange={(e) => setMovementQty(Math.min(showConsumeModal.stock, Math.max(1, Number(e.target.value))))}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-base font-bold text-amber-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Motivo / Destino del Material</label>
                <input
                  type="text"
                  required
                  value={movementReason}
                  onChange={(e) => setMovementReason(e.target.value)}
                  placeholder="Ej. Cambio de válvula en Torre Sky o mantenimiento de oficinas"
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowConsumeModal(null)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold"
                >
                  Confirmar Salida
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL: REGISTRAR NUEVO INSUMO EN CATÁLOGO */}
      {/* ========================================================= */}
      {showNewItemModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-[#CBD8CA] rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-[#2D4539] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#A3C7AD]" />
                <h3 className="font-serif-brand text-lg font-bold">Registrar Nuevo Insumo / Repuesto</h3>
              </div>
              <button onClick={() => setShowNewItemModal(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNewItemSubmit} className="p-6 space-y-4 text-xs overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Código del Insumo</label>
                  <input
                    type="text"
                    placeholder="Ej. INS-PLM-03"
                    value={newItemCode}
                    onChange={(e) => setNewItemCode(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-xs"
                  />
                  <span className="text-[10px] text-gray-400 mt-0.5 block">* Auto-generado si se deja en blanco</span>
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Categoría</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as any)}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                  >
                    <option value="Plomería">Plomería</option>
                    <option value="Electricidad">Electricidad</option>
                    <option value="Cerrajería">Cerrajería</option>
                    <option value="Climatización">Climatización</option>
                    <option value="Pintura">Pintura</option>
                    <option value="Herramientas">Herramientas</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nombre Completo del Insumo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Válvula Check de Retención 3/4 pulg. Bronce"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={newItemStock}
                    onChange={(e) => setNewItemStock(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Stock Mínimo</label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={newItemMinStock}
                    onChange={(e) => setNewItemMinStock(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Unidad de Medida</label>
                  <select
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                  >
                    <option value="Unidades">Unidades</option>
                    <option value="Piezas">Piezas</option>
                    <option value="Metros">Metros</option>
                    <option value="Galones">Galones</option>
                    <option value="Cajas">Cajas</option>
                    <option value="Rollos">Rollos</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Costo Unitario (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min={0}
                    required
                    value={newItemCost}
                    onChange={(e) => setNewItemCost(Number(e.target.value))}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 font-mono text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Ubicación en Bodega</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Bodega Principal - Estante B2"
                    value={newItemLocation}
                    onChange={(e) => setNewItemLocation(e.target.value)}
                    className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Notas / Especificaciones Técnicas</label>
                <input
                  type="text"
                  placeholder="Diámetro, marca, compatibilidad o proveedor habitual"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  className="w-full bg-white border border-[#CBD8CA] rounded-xl p-2.5 text-xs text-gray-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowNewItemModal(false)}
                  className="px-4 py-2 rounded-xl border border-gray-300 text-gray-700 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#2D4539] hover:bg-[#20342A] text-white font-bold"
                >
                  Guardar Insumo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
