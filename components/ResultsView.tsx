
import React from 'react';
import { VerificationResult, ClaimAnalysis } from '../types';

interface ResultsViewProps {
  result: VerificationResult;
}

const ResultsView: React.FC<ResultsViewProps> = ({ result }) => {
  const getStatusColor = (status: ClaimAnalysis['status']) => {
    switch (status) {
      case 'verified': return 'text-green-700 bg-green-50 border-green-200';
      case 'uncertain': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'hallucination': return 'text-red-700 bg-red-50 border-red-200';
      default: return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  const getStatusIcon = (status: ClaimAnalysis['status']) => {
    switch (status) {
      case 'verified':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'uncertain':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'hallucination':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Overview Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col md:flex-row items-center gap-8">
        <div className="relative w-32 h-32 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100"
            />
            <circle
              cx="64"
              cy="64"
              r="58"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={364}
              strokeDashoffset={364 - (364 * result.overallScore) / 100}
              className={`${result.overallScore > 70 ? 'text-green-500' : result.overallScore > 40 ? 'text-yellow-500' : 'text-red-500'} transition-all duration-1000 ease-out`}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-bold text-slate-900">{result.overallScore}%</span>
            <span className="text-[10px] uppercase font-bold text-slate-500">Reliability</span>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Analysis Summary</h2>
          <p className="text-slate-600 leading-relaxed">
            The verification process has identified <span className="font-semibold">{result.claims.length}</span> critical claims within the text. 
            Overall reliability is <span className="font-semibold">{result.overallScore < 50 ? 'Low' : result.overallScore < 80 ? 'Moderate' : 'High'}</span>. 
            Citations have been cross-referenced with real-time web data.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Claims List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            Claim Breakdown
          </h3>
          {result.claims.map((claim) => (
            <div key={claim.id} className={`p-5 rounded-xl border ${getStatusColor(claim.status)} transition-all hover:shadow-md`}>
              <div className="flex items-start justify-between mb-3">
                <span className="flex items-center text-xs font-bold uppercase tracking-wider">
                  {getStatusIcon(claim.status)}
                  <span className="ml-2">{claim.status}</span>
                </span>
                <span className="text-xs font-medium opacity-70">Confidence: {claim.confidence * 100}%</span>
              </div>
              <p className="text-slate-900 font-medium mb-2 leading-snug">{claim.text}</p>
              <p className="text-sm opacity-90 leading-relaxed italic border-l-2 border-current pl-3">
                {claim.explanation}
              </p>
              {claim.supportingEvidence && (
                <div className="mt-4 p-3 bg-white/50 rounded-lg text-sm">
                  <span className="font-bold block mb-1">Evidence:</span>
                  {claim.supportingEvidence}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Verification Sources */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center">
            <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            External Sources
          </h3>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {result.sources.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                <p>No external citations found.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {result.sources.map((source, idx) => (
                  <li key={idx}>
                    <a 
                      href={source.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-4 block hover:bg-slate-50 transition-colors group"
                    >
                      <span className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 block line-clamp-1">{source.title}</span>
                      <span className="text-xs text-slate-500 break-all">{source.uri}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-sm font-bold text-blue-900 mb-1">How it works</h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              We use Gemini 3's real-time grounding engine to fetch live web data and verify individual claims against trusted publications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsView;
