import { useState, useEffect, useMemo } from 'react';
import Header from './components/Header.jsx';
import StatsCards from './components/StatsCards.jsx';
import FilterBar from './components/FilterBar.jsx';
import RunnerTable from './components/RunnerTable.jsx';
import CertificateModal from './components/CertificateModal.jsx';
import ExportModal from './components/ExportModal.jsx';
import DisapproveModal from './components/DisapproveModal.jsx';
import runnersData from './data/runners.json';

const BUNNY_CDN_URL = import.meta.env.VITE_BUNNY_CDN_URL || 'https://runsatara.b-cdn.net';
const SHOW_EMAIL = import.meta.env.VITE_SHOW_RUNNER_EMAIL === 'true';
const ORGANIZER_PIN = import.meta.env.VITE_ORGANIZER_PIN || '1234';
const STORAGE_KEY = 'shhm_organizer_decisions_v1';

export default function App() {
  // Organizer decisions state (persisted in localStorage)
  const [organizerDecisions, setOrganizerDecisions] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to load organizer decisions:', e);
      return {};
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(organizerDecisions));
    } catch (e) {
      console.error('Failed to save organizer decisions:', e);
    }
  }, [organizerDecisions]);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMismatch, setFilterMismatch] = useState(false);
  const [filterRequested, setFilterRequested] = useState('ALL');
  const [filterExpected, setFilterExpected] = useState('ALL');
  const [filterOrganizerStatus, setFilterOrganizerStatus] = useState('ALL');
  const [filterEvidence, setFilterEvidence] = useState('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  // Modals State
  const [activeCertModalRunner, setActiveCertModalRunner] = useState(null);
  const [disapproveModalRunner, setDisapproveModalRunner] = useState(null);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Helper filter setters that reset page to 1
  const updateSearchQuery = (val) => { setSearchQuery(val); setCurrentPage(1); };
  const updateFilterMismatch = (val) => { setFilterMismatch(val); setCurrentPage(1); };
  const updateFilterRequested = (val) => { setFilterRequested(val); setCurrentPage(1); };
  const updateFilterExpected = (val) => { setFilterExpected(val); setCurrentPage(1); };
  const updateFilterOrganizerStatus = (val) => { setFilterOrganizerStatus(val); setCurrentPage(1); };
  const updateFilterEvidence = (val) => { setFilterEvidence(val); setCurrentPage(1); };
  const updatePageSize = (val) => { setPageSize(val); setCurrentPage(1); };

  // Toggle Organizer Status (Default Approved <-> Disapproved with PIN & Lineup Reassignment)
  const handleToggleStatus = (runnerId) => {
    const current = organizerDecisions[runnerId]?.status || 'APPROVED';
    const runner = runnersData.find(r => r.id === runnerId);

    if (current === 'APPROVED') {
      // Open Disapprove & Lineup Reassignment Modal
      if (runner) setDisapproveModalRunner(runner);
    } else {
      // Reverting from Disapproved back to Approved requires PIN
      const enteredPin = window.prompt('Enter Organizer Security PIN to revert runner back to Approved:');
      if (enteredPin === null) return; // cancelled
      if (String(enteredPin).trim() === String(ORGANIZER_PIN).trim()) {
        setOrganizerDecisions(prev => {
          const next = { ...prev };
          delete next[runnerId];
          return next;
        });
      } else {
        alert('Incorrect Security PIN. Record was not changed.');
      }
    }
  };

  // Confirm Disapproval and Reassign Lineup Section
  const handleConfirmDisapprove = (runnerId, assignedLineup, note) => {
    setOrganizerDecisions(prev => ({
      ...prev,
      [runnerId]: {
        status: 'DISAPPROVED',
        assignedLineup,
        note
      }
    }));
  };

  // Reset all organizer decisions
  const handleResetAllDecisions = () => {
    if (window.confirm('Are you sure you want to reset all manual organizer decisions back to default Approved?')) {
      setOrganizerDecisions({});
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterMismatch(false);
    setFilterRequested('ALL');
    setFilterExpected('ALL');
    setFilterOrganizerStatus('ALL');
    setFilterEvidence('ALL');
  };

  // Calculate Overall Stats
  const stats = useMemo(() => {
    const total = runnersData.length;
    const mismatchCount = runnersData.filter(r => r.isMismatch).length;
    const disapprovedCount = Object.values(organizerDecisions).filter(d => d.status === 'DISAPPROVED').length;
    const approvedCount = total - disapprovedCount;

    return { total, mismatchCount, approvedCount, disapprovedCount };
  }, [organizerDecisions]);

  // Filter Runners
  const filteredRunners = useMemo(() => {
    return runnersData.filter(runner => {
      // 1. Search Query
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const nameMatch = runner.name.toLowerCase().includes(q);
        const emailMatch = runner.email.toLowerCase().includes(q);
        const idMatch = runner.id.toLowerCase().includes(q);
        if (!nameMatch && !emailMatch && !idMatch) return false;
      }

      // 2. Mismatch Filter
      if (filterMismatch && !runner.isMismatch) return false;

      // 3. Requested Lineup Filter
      if (filterRequested !== 'ALL' && runner.requestedLineup !== filterRequested) return false;

      // 4. AI Expected Lineup Filter
      if (filterExpected !== 'ALL' && runner.expectedLineup !== filterExpected) return false;

      // 5. Organizer Status Filter
      if (filterOrganizerStatus !== 'ALL') {
        const status = organizerDecisions[runner.id]?.status || 'APPROVED';
        if (status !== filterOrganizerStatus) return false;
      }

      // 6. Evidence Provided Filter
      if (filterEvidence !== 'ALL' && runner.evidenceProvided !== filterEvidence) return false;

      return true;
    });
  }, [searchQuery, filterMismatch, filterRequested, filterExpected, filterOrganizerStatus, filterEvidence, organizerDecisions]);

  // Modal Navigation
  const certModalIndex = useMemo(() => {
    if (!activeCertModalRunner) return -1;
    return filteredRunners.findIndex(r => r.id === activeCertModalRunner.id);
  }, [activeCertModalRunner, filteredRunners]);

  const handlePrevCert = () => {
    if (certModalIndex > 0) {
      setActiveCertModalRunner(filteredRunners[certModalIndex - 1]);
    }
  };

  const handleNextCert = () => {
    if (certModalIndex < filteredRunners.length - 1) {
      setActiveCertModalRunner(filteredRunners[certModalIndex + 1]);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header
        bunnyCdnUrl={BUNNY_CDN_URL}
        totalCount={stats.total}
        disapprovedCount={stats.disapprovedCount}
        onExport={() => setIsExportModalOpen(true)}
        onResetAll={stats.disapprovedCount > 0 ? handleResetAllDecisions : null}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Summary Stats Cards */}
        <StatsCards
          stats={stats}
          currentFilterMismatch={filterMismatch}
          onToggleMismatchFilter={() => updateFilterMismatch(!filterMismatch)}
        />

        {/* Filter Controls Toolbar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={updateSearchQuery}
          filterMismatch={filterMismatch}
          onMismatchChange={updateFilterMismatch}
          filterRequested={filterRequested}
          onRequestedChange={updateFilterRequested}
          filterExpected={filterExpected}
          onExpectedChange={updateFilterExpected}
          filterOrganizerStatus={filterOrganizerStatus}
          onOrganizerStatusChange={updateFilterOrganizerStatus}
          filterEvidence={filterEvidence}
          onEvidenceChange={updateFilterEvidence}
          onResetFilters={handleResetFilters}
          totalFilteredCount={filteredRunners.length}
          totalCount={stats.total}
          showEmail={SHOW_EMAIL}
        />

        {/* Interactive Runner Table */}
        <RunnerTable
          runners={filteredRunners}
          bunnyCdnUrl={BUNNY_CDN_URL}
          organizerDecisions={organizerDecisions}
          onToggleStatus={handleToggleStatus}
          onOpenCertificate={(runner) => setActiveCertModalRunner(runner)}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={updatePageSize}
          showEmail={SHOW_EMAIL}
        />

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 text-center text-xs text-slate-500">
        Satara Hill Half Marathon — Lineup Verification System • Built for Race Organizers
      </footer>

      {/* Certificate Lightbox Modal */}
      {activeCertModalRunner && (
        <CertificateModal
          runner={activeCertModalRunner}
          fullCertUrl={`${BUNNY_CDN_URL.replace(/\/$/, '')}/${activeCertModalRunner.certificateFile}`}
          onClose={() => setActiveCertModalRunner(null)}
          onPrev={handlePrevCert}
          onNext={handleNextCert}
          hasPrev={certModalIndex > 0}
          hasNext={certModalIndex < filteredRunners.length - 1}
          organizerDecision={organizerDecisions[activeCertModalRunner.id]}
          onToggleStatus={handleToggleStatus}
          showEmail={SHOW_EMAIL}
        />
      )}

      {/* Disapprove & Lineup Reassignment Modal */}
      {disapproveModalRunner && (
        <DisapproveModal
          runner={disapproveModalRunner}
          currentDecision={organizerDecisions[disapproveModalRunner.id]}
          securityPin={ORGANIZER_PIN}
          onConfirm={handleConfirmDisapprove}
          onClose={() => setDisapproveModalRunner(null)}
        />
      )}

      {/* Export Report Modal */}
      {isExportModalOpen && (
        <ExportModal
          runners={runnersData}
          organizerDecisions={organizerDecisions}
          onClose={() => setIsExportModalOpen(false)}
        />
      )}

    </div>
  );
}
