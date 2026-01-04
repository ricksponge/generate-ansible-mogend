
import React, { useState } from 'react';

interface TechnicalReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialEnv?: string;
}

const REPORT_DATA: Record<string, any> = {
  qual: {
    title: "RPT_M472_ENV_QUAL",
    ref: "1/7",
    vs: [
      { name: "vs-qual-m472-proxyma-app-443-fe", ip: "10.227.65.222", port: "443", pool: "443", dns: "morice.proxyma.ipms.qual.internal" }
    ],
    vms: [
      { name: "dasqipmsm90principal01", ip: "10.227.84.216", acc: "MT", vlan: "VL112_T12_QUAL_BE_01", os: "DEB 12" },
      { name: "dasqipmsm90recherche01", ip: "10.227.84.249", acc: "MT", vlan: "VL112_T12_QUAL_BE_01", os: "DEB 12" },
      { name: "dasqipmsm90connecteur01", ip: "10.227.84.252", acc: "MT", vlan: "VL112_T12_QUAL_BE_01", os: "DEB 12" },
      { name: "dasqipmsm90connecteurocr01", ip: "10.227.84.255", acc: "MT", vlan: "VL112_T12_QUAL_BE_01", os: "DEB 12" }
    ],
    sgbd: [
      { name: "dapqosvcbdm90all", ip: "10.227.169.52", acc: "MT", vlan: "VL107_METIER-QUAL-T3-01", type: "PostgreSQL 16" }
    ],
    nfs: [
      { server: "10.227.80.13", path: "/srv/nfs/morice", size: "100Go" }
    ]
  },
  preprod: {
    title: "RPT M472 PPROD MORICE V2",
    ref: "1/2",
    vs: [
      { name: "vs-pprod-m472-app-proxyma-443-be", ip: "10.227.23.17", port: "443", pool: "443", dns: "morice.proxyma.ipms.prep.internal" }
    ],
    vms: [
      { name: "dmpiipmsm472principal01", ip: "10.227.53.66", acc: "MT", vlan: "VL273", os: "DEB 12" },
      { name: "dmpiipmsm472recherche01", ip: "10.227.53.67", acc: "MT", vlan: "VL273", os: "DEB 12" },
      { name: "dmpiipmsm472connecteur01", ip: "10.227.53.68", acc: "MT", vlan: "VL273", os: "DEB 12" },
      { name: "dmpiipmsm472connecteurocr01", ip: "10.227.53.69", acc: "MT", vlan: "VL273", os: "DEB 12" }
    ],
    sgbd: [
      { name: "dapiosvcbdmorice.pp.pgs", ip: "172.18.24.183", acc: "ADM", vlan: "VL124", type: "PostgreSQL 16" }
    ],
    nfs: [
      { server: "10.227.53.3", path: "/backup", size: "N/A" }
    ]
  },
  prod: {
    title: "RPT M472 PROD MORICEV2",
    ref: "1/10",
    vs: [
      { name: "vs-prod-m472-principal-443-be", ip: "10.226.22.35", port: "443", pool: "443", dns: "principal.morice.ipms.internal" }
    ],
    vms: [
      { name: "dmppipmsm472principal01", ip: "10.226.72.87/24", acc: "MET", vlan: "572", os: "DEBIAN 12" },
      { name: "dmppipmsm472recherche01", ip: "10.226.72.88/24", acc: "MET", vlan: "572", os: "DEBIAN 12" },
      { name: "dmppipmsm472connecteur01", ip: "10.226.72.89/24", acc: "MET", vlan: "572", os: "DEBIAN 12" },
      { name: "dmppipmsm472connecteurocr01", ip: "10.226.72.90/24", acc: "MET", vlan: "572", os: "DEBIAN 12" }
    ],
    sgbd: [
      { name: "dasposvcbdmoricev2.pgs", ip: "172.16.96.120/20", acc: "MET", vlan: "431", type: "PostgreSQL 15" }
    ],
    nfs: [
      { server: "Ealfsabege572.ipms.private:/M472_MORICEV2", path: "/backup", size: "500 GB" }
    ],
    s3: [
      { url: "https://scality-s3.gendarmerie.fr/_/s3browser/buckets/[nom_bucket]", quota: "Xxx GB" }
    ]
  }
};

const TechnicalReportModal: React.FC<TechnicalReportModalProps> = ({ isOpen, onClose, initialEnv = 'qual' }) => {
  const [selectedEnv, setSelectedEnv] = useState(initialEnv);
  
  if (!isOpen) return null;

  const data = REPORT_DATA[selectedEnv];

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-2xl text-emerald-500">📄</div>
            <div>
              <h2 className="text-xl font-bold text-white uppercase tracking-tight">Rapport d'Architecture Technique (RPT)</h2>
              <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">{data.title} — {selectedEnv.toUpperCase()}</p>
            </div>
          </div>

          <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
            {Object.keys(REPORT_DATA).map(env => (
              <button
                key={env}
                onClick={() => setSelectedEnv(env)}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all uppercase tracking-widest ${
                  selectedEnv === env 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {env}
              </button>
            ))}
          </div>

          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:text-white transition-colors">×</button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar bg-slate-950/20">
          
          {/* Section 1: Serveurs Virtuels */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-emerald-500 uppercase tracking-[0.2em] flex items-center">
              <span className="w-1.5 h-4 bg-emerald-500 mr-3 rounded-full"></span>
              1. SERVEURS VIRTUELS (VS)
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">IP</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Port</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">DNS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.vs.map((row: any, i: number) => (
                    <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-emerald-400 font-mono">{row.name}</td>
                      <td className="px-6 py-4 text-xs font-bold text-white font-mono">{row.ip}</td>
                      <td className="px-6 py-4 text-xs text-slate-400">{row.port}</td>
                      <td className="px-6 py-4 text-[10px] text-slate-500 italic">{row.dns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 2: Machines Virtuelles */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center">
              <span className="w-1.5 h-4 bg-indigo-500 mr-3 rounded-full"></span>
              2. MACHINES VIRTUELLES (VM)
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-800/50">
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Nom / FQDN</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">IP</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Patte</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">VLAN / Subnet</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">OS</th>
                  </tr>
                </thead>
                <tbody>
                  {data.vms.map((row: any, i: number) => (
                    <tr key={i} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors group">
                      <td className="px-6 py-4 text-[11px] font-bold text-indigo-400 font-mono group-hover:text-indigo-300">{row.name}</td>
                      <td className="px-6 py-4 text-xs font-bold text-white font-mono">{row.ip}</td>
                      <td className="px-6 py-4 text-[10px] text-slate-500 font-bold">{row.acc}</td>
                      <td className="px-6 py-4 text-[10px] text-slate-400">{row.vlan}</td>
                      <td className="px-6 py-4 text-[10px] bg-slate-800/30 text-slate-500 font-mono text-center">{row.os}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: SGBD */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-amber-500 uppercase tracking-[0.2em] flex items-center">
              <span className="w-1.5 h-4 bg-amber-500 mr-3 rounded-full"></span>
              3. CONTENEURS SGBD - BASES DE DONNÉES
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.sgbd.map((db: any, i: number) => (
                <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-between group hover:border-amber-500/50 transition-all">
                  <div className="space-y-1">
                    <div className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{db.type}</div>
                    <div className="text-sm font-bold text-white font-mono">{db.name}</div>
                    <div className="text-xs text-slate-500 font-mono">{db.ip} (Patte {db.acc})</div>
                  </div>
                  <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[10px] text-amber-500 font-bold uppercase">
                    VLAN {db.vlan}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Stockage */}
          <section className="space-y-4">
            <h3 className="text-xs font-black text-rose-500 uppercase tracking-[0.2em] flex items-center">
              <span className="w-1.5 h-4 bg-rose-500 mr-3 rounded-full"></span>
              4. STOCKAGE (NFS / S3)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.nfs.map((nfs: any, i: number) => (
                <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xl">📂</span>
                    <span className="px-2 py-0.5 bg-rose-500/10 border border-rose-500/30 rounded text-[10px] text-rose-500 font-black">NFS</span>
                  </div>
                  <div>
                    <div className="text-[11px] font-bold text-white font-mono break-all">{nfs.server}</div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter mt-1">Point de montage : {nfs.path}</div>
                  </div>
                  <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 italic">Quota : {nfs.size}</div>
                </div>
              ))}
              {data.s3?.map((s3: any, i: number) => (
                <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xl">☁️</span>
                    <span className="px-2 py-0.5 bg-blue-500/10 border border-blue-500/30 rounded text-[10px] text-blue-500 font-black">S3 OBJECT</span>
                  </div>
                  <div className="text-[10px] font-mono text-blue-400 break-all">{s3.url}</div>
                  <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-400 italic">Quota : {s3.quota}</div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="px-8 py-6 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
          <p className="text-[10px] text-slate-500 font-mono italic uppercase tracking-widest">
            Source : Dossier Architecture Technique — Page {data.ref}
          </p>
          <div className="flex items-center space-x-4">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 px-3 py-1.5 rounded-xl font-bold uppercase tracking-widest">STIG / ANFSI Verified</span>
            <button 
              onClick={onClose}
              className="px-8 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
            >
              Fermer le rapport
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicalReportModal;
