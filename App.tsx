
import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import ResultsView from './components/ResultsView';
import { verifyText } from './services/geminiService';
import { VerificationResult, VerificationStatus } from './types';

const App: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [status, setStatus] = useState<VerificationStatus>(VerificationStatus.IDLE);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!inputText.trim()) return;
    
    setStatus(VerificationStatus.ANALYZING);
    setError(null);
    setResult(null);

    try {
      const verificationResult = await verifyText(inputText);
      setResult(verificationResult);
      setStatus(VerificationStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred during verification.');
      setStatus(VerificationStatus.ERROR);
    }
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
    setStatus(VerificationStatus.IDLE);
    setError(null);
  };

  const exampleText = `The Great Wall of China is the only human-made structure visible from the moon with the naked eye. Research from NASA (2024) suggests that construction began in the 7th century BC. A recent paper by Dr. Li Wei in the 'Global History Journal' claims that over 20,000 km of the wall still stands today.`;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            Stop AI Hallucinations in <span className="text-blue-600">Their Tracks</span>
          </h1>
          <p className="text-lg text-slate-600">
            Verify factual claims, detect fake citations, and cross-reference AI-generated content with real-time web grounding.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12">
          {/* Input Section */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden flex flex-col">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest px-2">Text Analysis Engine</span>
              <button 
                onClick={() => setInputText(exampleText)}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full transition-colors"
              >
                Insert Example
              </button>
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste AI-generated content or claims here to verify..."
              className="w-full h-48 md:h-64 p-6 focus:ring-0 focus:outline-none text-slate-800 text-lg leading-relaxed placeholder:text-slate-300 resize-none"
            />
            <div className="p-4 bg-white border-t border-slate-100 flex items-center justify-between">
              <div className="flex space-x-2">
                <button
                  onClick={handleClear}
                  className="px-6 py-3 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all active:scale-95"
                  disabled={status === VerificationStatus.ANALYZING}
                >
                  Clear
                </button>
                <button
                  onClick={handleVerify}
                  disabled={status === VerificationStatus.ANALYZING || !inputText.trim()}
                  className={`px-8 py-3 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/30 hover:bg-blue-700 transition-all flex items-center space-x-3 active:scale-95 ${status === VerificationStatus.ANALYZING ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {status === VerificationStatus.ANALYZING ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Analyzing Claims...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <span>Verify Now</span>
                    </>
                  )}
                </button>
              </div>
              <div className="hidden sm:block text-xs text-slate-400">
                Powered by Gemini 3 Grounding Engine
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-2xl flex items-center animate-in fade-in zoom-in duration-300">
              <svg className="w-6 h-6 mr-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-bold">Verification Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {result && <ResultsView result={result} />}

          {/* Empty State */}
          {!result && status === VerificationStatus.IDLE && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Claim Extraction</h3>
                <p className="text-sm text-slate-500">We automatically parse your text to find discrete factual claims that need checking.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Web Grounding</h3>
                <p className="text-sm text-slate-500">Using the latest Google Search data, we verify claims against authoritative sources.</p>
              </div>
              <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">Fake Citation Check</h3>
                <p className="text-sm text-slate-500">Detecting "hallucinated" papers, URLs, and references that don't exist in reality.</p>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-slate-900 text-slate-400 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-6 md:mb-0">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-tight">VeriAI</span>
          </div>
          <div className="flex space-x-8 text-sm">
            
            <a href="#" className="hover:text-white transition-colors">Team Gurudev</a>
            
          </div>
          
        </div>
      </footer>
    </div>
  );
};

export default App;
