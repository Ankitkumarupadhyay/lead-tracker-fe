import React, { useCallback, useEffect, useState } from 'react';
import type { CreateLeadPayload, Lead, LeadStats, LeadStatus } from './types/lead';
import { leadsApi } from './api/leadsApi';
import { useDebounce } from './hooks/useDebounce';
import { Header } from './components/Header';
import { StatsDashboard } from './components/StatsDashboard';
import { FilterBar } from './components/FilterBar';
import { LeadTable } from './components/LeadTable';
import { Pagination } from './components/Pagination';
import { CreateLeadModal } from './components/CreateLeadModal';
import { ToastContainer, type ToastMessage } from './components/Toast';

export const App: React.FC = () => {
  // Theme state
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('stylework_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  // Data state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);

  // Filter & Pagination state
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 350);
  const [selectedStatus, setSelectedStatus] = useState<LeadStatus | ''>('');
  const [sortBy, setSortBy] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);

  // Loading & Action state
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [updatingLeadId, setUpdatingLeadId] = useState<string | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (
    type: 'success' | 'error' | 'info',
    title: string,
    description?: string,
  ) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Sync theme with HTML root attribute
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('stylework_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Fetch leads from API
  const loadLeads = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await leadsApi.getLeads({
        q: debouncedSearch,
        status: selectedStatus,
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
      });

      setLeads(res.data);
      setTotalItems(res.meta.total);
      setTotalPages(res.meta.totalPages);
      setIsBackendHealthy(true);
    } catch (err: any) {
      setIsBackendHealthy(false);
      addToast(
        'error',
        'Failed to load leads',
        err.message || 'Could not connect to the API server.',
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [debouncedSearch, selectedStatus, currentPage, itemsPerPage, sortBy, sortOrder]);

  // Fetch statistics
  const loadStats = useCallback(async () => {
    try {
      const data = await leadsApi.getStats();
      setStats(data);
      setIsBackendHealthy(true);
    } catch {
      // stats error handled silently or with fallback
    }
  }, []);

  // Initial load & when parameters change
  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // Reset to page 1 whenever search query or status filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedStatus]);

  // Handle manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadLeads(), loadStats()]);
  };

  // Handle lead creation
  const handleCreateLead = async (payload: CreateLeadPayload) => {
    try {
      const created = await leadsApi.createLead(payload);
      addToast(
        'success',
        'Lead Created Successfully',
        `Added "${created.name}" as ${created.status} lead.`,
      );
      // Reload list and stats
      await Promise.all([loadLeads(), loadStats()]);
    } catch (err: any) {
      addToast(
        'error',
        'Failed to create lead',
        err.message || 'Please check the entered values and try again.',
      );
      throw err;
    }
  };

  // Handle inline status update with optimistic UI
  const handleUpdateStatus = async (id: string, newStatus: LeadStatus) => {
    const previousLeads = [...leads];
    // Optimistic update
    setLeads((prev) =>
      prev.map((lead) =>
        lead._id === id ? { ...lead, status: newStatus } : lead,
      ),
    );

    try {
      setUpdatingLeadId(id);
      const updated = await leadsApi.updateStatus(id, { status: newStatus });
      addToast(
        'success',
        'Status Updated',
        `Lead "${updated.name}" is now marked as ${updated.status}.`,
      );
      // Refresh stats
      loadStats();
    } catch (err: any) {
      // Revert optimistic update
      setLeads(previousLeads);
      addToast(
        'error',
        'Failed to update status',
        err.message || 'An error occurred while updating status.',
      );
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedStatus('');
  };

  const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);
  };

  return (
    <div className="app-wrapper">
      <Header
        onOpenCreateModal={() => setIsCreateModalOpen(true)}
        isBackendHealthy={isBackendHealthy}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      <main className="main-content">
        {/* Performance Metrics Dashboard */}
        <StatsDashboard
          stats={stats}
          activeStatus={selectedStatus}
          onSelectStatus={(st) => setSelectedStatus(st)}
          isLoading={isLoading}
        />

        {/* Filter, Search & Controls */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          stats={stats}
          onRefresh={handleRefresh}
          isRefreshing={isRefreshing}
        />

        {/* Leads Table & Cards */}
        <LeadTable
          leads={leads}
          isLoading={isLoading}
          onUpdateStatus={handleUpdateStatus}
          updatingLeadId={updatingLeadId}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          hasFilters={Boolean(searchQuery || selectedStatus)}
          onClearFilters={handleClearFilters}
        />

        {/* Pagination Controls */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onLimitChange={(limit) => {
            setItemsPerPage(limit);
            setCurrentPage(1);
          }}
        />
      </main>

      {/* Modal Dialog for Lead Creation */}
      <CreateLeadModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateLead}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
};

export default App;
