import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./components/ui/tabs";
import { Dashboard } from "./components/Dashboard";
import { NewSession } from "./components/NewSessionSection";
import { PendingTasks } from "./components/PendingTasks";
import { SessionHistory } from "./components/SessionHistory";
import { ActiveLeads } from "./components/ActiveLeads";
import { MasterIntelligenceReport } from "./components/MasterIntelligenceReport";
import { Toaster } from "./components/ui/sonner";

// App principal de Wakee - Prospección Inteligente C&W
function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#1F554A] text-white border-b border-[#1F554A]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-base sm:text-lg font-medium">
                Wakee
              </h1>
              <p className="text-xs sm:text-sm text-white/80">
                Prospección Inteligente
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs sm:text-sm font-medium">
                Camilo V.
              </p>
              <p className="text-[10px] sm:text-xs text-white/70">
                LABAI GENT
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="border-b border-[#DCDEDC] bg-white overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-transparent border-0 p-0 h-auto flex whitespace-nowrap">
              <TabsTrigger
                value="dashboard"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1F554A] data-[state=active]:bg-transparent data-[state=active]:text-[#1F554A] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#141414]"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger
                value="new-session"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1F554A] data-[state=active]:bg-transparent data-[state=active]:text-[#1F554A] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#141414]"
              >
                Nueva Sesión
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1F554A] data-[state=active]:bg-transparent data-[state=active]:text-[#1F554A] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#141414]"
              >
                Segmentación
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1F554A] data-[state=active]:bg-transparent data-[state=active]:text-[#1F554A] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#141414]"
              >
                Historial
              </TabsTrigger>
              <TabsTrigger
                value="leads"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1F554A] data-[state=active]:bg-transparent data-[state=active]:text-[#1F554A] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#141414]"
              >
                Leads
              </TabsTrigger>
              <TabsTrigger
                value="report"
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-[#1F554A] data-[state=active]:bg-transparent data-[state=active]:text-[#1F554A] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-[#141414]"
              >
                Report
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={activeTab}>
          <TabsContent value="dashboard" className="mt-0">
            <Dashboard
              onNewSession={() => setActiveTab("new-session")}
            />
          </TabsContent>
          <TabsContent value="new-session" className="mt-0">
            <NewSession
              onComplete={() => setActiveTab("pending")}
            />
          </TabsContent>
          <TabsContent value="pending" className="mt-0">
            <PendingTasks />
          </TabsContent>
          <TabsContent value="history" className="mt-0">
            <SessionHistory />
          </TabsContent>
          <TabsContent value="leads" className="mt-0">
            <ActiveLeads />
          </TabsContent>
          <TabsContent value="report" className="mt-0">
            <MasterIntelligenceReport />
          </TabsContent>
        </Tabs>
      </main>

      <Toaster />
    </div>
  );
}

export default App;