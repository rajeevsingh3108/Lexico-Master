import React, { useState, useEffect } from 'react';
import {
  Search, Sun, Moon, BookOpen, Lightbulb, ArrowUpDown,
  FileText, Sparkles, Volume2, Star, Heart, Zap, Trophy
} from 'lucide-react';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return darkMode ? 'text-emerald-400' : 'text-emerald-600';
      case 'intermediate': return darkMode ? 'text-amber-400' : 'text-orange-600';
      case 'advanced': return darkMode ? 'text-rose-400' : 'text-rose-600';
      default: return darkMode ? 'text-slate-400' : 'text-slate-600';
    }
  };

  const getDifficultyBg = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return darkMode ? 'bg-emerald-900/30 border-emerald-500/30' : 'bg-emerald-100/80 border-emerald-300/50';
      case 'intermediate': return darkMode ? 'bg-amber-900/30 border-amber-500/30' : 'bg-amber-100/80 border-amber-300/50';
      case 'advanced': return darkMode ? 'bg-rose-900/30 border-rose-500/30' : 'bg-rose-100/80 border-rose-300/50';
      default: return darkMode ? 'bg-slate-900/30 border-slate-500/30' : 'bg-slate-100/80 border-slate-300/50';
    }
  };

  const searchWord = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    setWordData(null);

    try {
      const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${searchTerm}`);
      if (!response.ok) {
        throw new Error(`Word "${searchTerm}" not found in the dictionary.`);
      }

      const data = await response.json();
      const entry = data[0];
      const meanings = entry.meanings || [];
      const firstMeaning = meanings.find(m => m.definitions?.length > 0);

      if (!firstMeaning) {
        throw new Error(`No valid definitions found for "${searchTerm}".`);
      }

      const wordInfo = {
        meaning: firstMeaning.definitions[0].definition,
        partOfSpeech: firstMeaning.partOfSpeech,
        pronunciation: entry.phonetics?.[0]?.text || entry.phonetic || '',
        difficulty: 'intermediate', // Can be enhanced with frequency APIs
        synonyms: firstMeaning.synonyms || [],
        antonyms: firstMeaning.antonyms || [],
        examples: firstMeaning.definitions
          .map(def => def.example)
          .filter(Boolean)
          .slice(0, 4),
      };

      setWordData(wordInfo);
    } catch (err) {
      setError(err.message);
      setWordData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchWord();
    }
  };

  const speakWord = () => {
    if ('speechSynthesis' in window && searchTerm) {
      const utterance = new SpeechSynthesisUtterance(searchTerm);
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen transition-all duration-700 ${
      darkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-rose-50 via-orange-50 to-pink-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/6 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse ${
          darkMode ? 'bg-purple-500' : 'bg-rose-300'
        }`}></div>
        <div className={`absolute top-3/4 right-1/6 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000 ${
          darkMode ? 'bg-cyan-500' : 'bg-orange-300'
        }`}></div>
        <div className={`absolute top-1/2 left-1/2 w-72 h-72 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500 ${
          darkMode ? 'bg-pink-500' : 'bg-pink-300'
        }`}></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="container mx-auto px-6 py-8">
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center space-x-4">
              <div className={`relative p-4 rounded-3xl ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-gradient-to-r from-rose-500 to-orange-500'
              } shadow-2xl hover:scale-110 transition-transform duration-300`}>
                <BookOpen className="h-10 w-10 text-white" />
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full animate-bounce flex items-center justify-center">
                  <Sparkles className="h-3 w-3 text-yellow-800" />
                </div>
              </div>
              <div>
                <h1 className={`text-4xl font-black bg-gradient-to-r ${
                  darkMode 
                    ? 'from-purple-400 to-pink-400' 
                    : 'from-rose-600 to-orange-600'
                } bg-clip-text text-transparent`}>
                  LexicoMaster
                </h1>
                <p className={`text-lg font-semibold ${
                  darkMode ? 'text-purple-300' : 'text-rose-600'
                }`}>
                  Discover words, unlock meanings
                </p>
              </div>
            </div>
            
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative p-4 rounded-2xl transition-all duration-500 hover:scale-110 ${
                darkMode 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 shadow-2xl shadow-yellow-500/25' 
                  : 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-2xl shadow-slate-500/25'
              }`}
            >
              {darkMode ? <Sun className="h-7 w-7" /> : <Moon className="h-7 w-7" />}
              <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Search Section */}
          <div className="max-w-4xl mx-auto mb-16">
            <div className={`relative p-2 rounded-3xl ${
              darkMode 
                ? 'bg-slate-800/60 backdrop-blur-xl border border-slate-700/50' 
                : 'bg-white/80 backdrop-blur-xl border border-white/60'
            } shadow-2xl hover:shadow-3xl transition-all duration-500`}>
              <div className="relative">
                <Search className={`absolute left-6 top-1/2 transform -translate-y-1/2 h-6 w-6 ${
                  darkMode ? 'text-purple-400' : 'text-rose-500'
                }`} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type any word to explore its universe..."
                  className={`w-full pl-16 pr-44 py-6 text-xl font-medium rounded-2xl border-0 focus:outline-none focus:ring-0 ${
                    darkMode 
                      ? 'bg-transparent text-white placeholder-slate-400' 
                      : 'bg-transparent text-slate-800 placeholder-slate-500'
                  }`}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-2">
                  <button
                    onClick={speakWord}
                    className={`p-3 rounded-xl transition-all duration-300 hover:scale-110 ${
                      darkMode
                        ? 'bg-purple-600/80 hover:bg-purple-600 text-white'
                        : 'bg-rose-100 hover:bg-rose-200 text-rose-600'
                    }`}
                  >
                    <Volume2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={searchWord}
                    disabled={loading}
                    className={`px-8 py-3 rounded-xl font-bold transition-all duration-300 ${
                      loading
                        ? 'bg-slate-400 cursor-not-allowed text-white'
                        : darkMode
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-xl shadow-purple-500/25'
                        : 'bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white shadow-xl shadow-rose-500/25'
                    } hover:scale-105 hover:shadow-2xl`}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Searching...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Zap className="h-5 w-5" />
                        <span>Explore</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className={`max-w-4xl mx-auto p-6 rounded-2xl mb-8 ${
              darkMode 
                ? 'bg-red-900/30 border border-red-500/30 backdrop-blur-sm' 
                : 'bg-red-100/80 border border-red-300/50 backdrop-blur-sm'
            } shadow-xl`}>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <p className={`text-lg font-medium ${
                  darkMode ? 'text-red-300' : 'text-red-700'
                }`}>
                  {error}
                </p>
              </div>
            </div>
          )}

          {/* Results Section */}
          {wordData && (
            <div className="max-w-7xl mx-auto">
              {/* Word Header Card */}
              <div className={`p-10 rounded-3xl mb-10 ${
                darkMode 
                  ? 'bg-slate-800/40 backdrop-blur-xl border border-slate-700/30' 
                  : 'bg-white/70 backdrop-blur-xl border border-white/50'
              } shadow-2xl hover:shadow-3xl transition-all duration-500`}>
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-6">
                      <h2 className={`text-5xl font-black capitalize bg-gradient-to-r ${
                        darkMode 
                          ? 'from-purple-400 via-pink-400 to-cyan-400' 
                          : 'from-rose-600 via-orange-600 to-pink-600'
                      } bg-clip-text text-transparent`}>
                        {searchTerm}
                      </h2>
                      <div className="flex items-center space-x-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getDifficultyBg(wordData.difficulty)} ${getDifficultyColor(wordData.difficulty)}`}>
                          <Trophy className="inline h-4 w-4 mr-1" />
                          {wordData.difficulty?.toUpperCase()}
                        </span>
                        <Heart className={`h-7 w-7 ${
                          darkMode ? 'text-pink-400' : 'text-rose-500'
                        } hover:scale-125 transition-transform cursor-pointer`} />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 mb-8">
                      <span className={`text-lg font-bold px-5 py-3 rounded-2xl ${
                        darkMode 
                          ? 'bg-cyan-900/40 text-cyan-300 border border-cyan-700/50' 
                          : 'bg-cyan-100/70 text-cyan-700 border border-cyan-200'
                      }`}>
                        {wordData.partOfSpeech}
                      </span>
                      {wordData.pronunciation && (
                        <div className="flex items-center space-x-2">
                          <span className={`text-lg font-mono px-4 py-2 rounded-lg ${
                            darkMode ? 'text-slate-300 bg-slate-700/50' : 'text-slate-600 bg-slate-100/70'
                          }`}>
                            {wordData.pronunciation}
                          </span>
                          <button onClick={speakWord} className="hover:scale-110 transition-transform">
                            <Volume2 className={`h-6 w-6 ${
                              darkMode ? 'text-purple-400' : 'text-rose-600'
                            }`} />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <Lightbulb className={`h-8 w-8 mt-1 ${
                        darkMode ? 'text-yellow-400' : 'text-amber-500'
                      }`} />
                      <p className={`text-xl leading-relaxed font-medium ${
                        darkMode ? 'text-slate-200' : 'text-slate-700'
                      }`}>
                        {wordData.meaning}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Grid */}
              <div className="grid lg:grid-cols-3 gap-8 mb-10">
                {/* Synonyms */}
                {wordData.synonyms.length > 0 && (
                  <div className={`p-8 rounded-3xl ${
                    darkMode 
                      ? 'bg-emerald-900/20 backdrop-blur-xl border border-emerald-800/30' 
                      : 'bg-emerald-50/90 backdrop-blur-xl border border-emerald-200/60'
                  } shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105`}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`p-3 rounded-2xl ${
                        darkMode 
                          ? 'bg-gradient-to-r from-emerald-600 to-green-600' 
                          : 'bg-gradient-to-r from-emerald-500 to-green-500'
                      } shadow-lg`}>
                        <ArrowUpDown className="h-6 w-6 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold ${
                        darkMode ? 'text-emerald-300' : 'text-emerald-700'
                      }`}>
                        Synonyms
                      </h3>
                      <Star className={`h-5 w-5 ${
                        darkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {wordData.synonyms.map((synonym, index) => (
                        <span
                          key={index}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                            darkMode 
                              ? 'bg-emerald-800/40 text-emerald-200 border border-emerald-700/50 hover:bg-emerald-700/60 hover:scale-110' 
                              : 'bg-emerald-100/90 text-emerald-800 border border-emerald-200 hover:bg-emerald-200/90 hover:scale-110'
                          } shadow-md hover:shadow-lg`}
                        >
                          {synonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Antonyms */}
                {wordData.antonyms.length > 0 && (
                  <div className={`p-8 rounded-3xl ${
                    darkMode 
                      ? 'bg-rose-900/20 backdrop-blur-xl border border-rose-800/30' 
                      : 'bg-rose-50/90 backdrop-blur-xl border border-rose-200/60'
                  } shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105`}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`p-3 rounded-2xl ${
                        darkMode 
                          ? 'bg-gradient-to-r from-rose-600 to-red-600' 
                          : 'bg-gradient-to-r from-rose-500 to-red-500'
                      } shadow-lg`}>
                        <ArrowUpDown className="h-6 w-6 text-white rotate-180" />
                      </div>
                      <h3 className={`text-2xl font-bold ${
                        darkMode ? 'text-rose-300' : 'text-rose-700'
                      }`}>
                        Antonyms
                      </h3>
                      <Star className={`h-5 w-5 ${
                        darkMode ? 'text-rose-400' : 'text-rose-600'
                      }`} />
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {wordData.antonyms.map((antonym, index) => (
                        <span
                          key={index}
                          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                            darkMode 
                              ? 'bg-rose-800/40 text-rose-200 border border-rose-700/50 hover:bg-rose-700/60 hover:scale-110' 
                              : 'bg-rose-100/90 text-rose-800 border border-rose-200 hover:bg-rose-200/90 hover:scale-110'
                          } shadow-md hover:shadow-lg`}
                        >
                          {antonym}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Examples */}
                {wordData.examples.length > 0 && (
                  <div className={`p-8 rounded-3xl ${
                    wordData.synonyms.length === 0 && wordData.antonyms.length === 0 ? 'lg:col-span-3' : 
                    wordData.synonyms.length === 0 || wordData.antonyms.length === 0 ? 'lg:col-span-2' : ''
                  } ${
                    darkMode 
                      ? 'bg-blue-900/20 backdrop-blur-xl border border-blue-800/30' 
                      : 'bg-blue-50/90 backdrop-blur-xl border border-blue-200/60'
                  } shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105`}>
                    <div className="flex items-center space-x-3 mb-6">
                      <div className={`p-3 rounded-2xl ${
                        darkMode 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-600' 
                          : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                      } shadow-lg`}>
                        <FileText className="h-6 w-6 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold ${
                        darkMode ? 'text-blue-300' : 'text-blue-700'
                      }`}>
                        Examples
                      </h3>
                      <Star className={`h-5 w-5 ${
                        darkMode ? 'text-blue-400' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="space-y-4">
                      {wordData.examples.map((example, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-2xl transition-all duration-300 hover:scale-105 ${
                            darkMode 
                              ? 'bg-blue-800/30 border-l-4 border-blue-400 hover:bg-blue-800/50' 
                              : 'bg-blue-100/80 border-l-4 border-blue-500 hover:bg-blue-200/80'
                          } shadow-md hover:shadow-lg`}
                        >
                          <p className={`text-sm font-medium leading-relaxed ${
                            darkMode ? 'text-blue-100' : 'text-blue-900'
                          }`}>
                            <span className="text-2xl">"</span>
                            {example}
                            <span className="text-2xl">"</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Success Message */}
              <div className={`p-8 rounded-3xl text-center ${
                darkMode 
                  ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 backdrop-blur-xl border border-purple-700/30' 
                  : 'bg-gradient-to-r from-rose-100/80 to-orange-100/80 backdrop-blur-xl border border-rose-200/50'
              } shadow-2xl`}>
                <div className="flex justify-center mb-4">
                  <div className={`p-4 rounded-full ${
                    darkMode 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                      : 'bg-gradient-to-r from-rose-500 to-orange-500'
                  } shadow-lg`}>
                    <Sparkles className="h-8 w-8 text-white animate-pulse" />
                  </div>
                </div>
                <h4 className={`text-2xl font-bold mb-2 ${
                  darkMode ? 'text-purple-300' : 'text-rose-700'
                }`}>
                  Word Discovered! 🎉
                </h4>
                <p className={`text-lg ${
                  darkMode ? 'text-purple-200' : 'text-rose-600'
                }`}>
                  You've successfully explored "<span className="font-bold capitalize">{searchTerm}</span>" - Keep expanding your vocabulary!
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className={`text-center mt-20 pt-8 border-t ${
            darkMode ? 'border-slate-700/50 text-slate-400' : 'border-slate-200/50 text-slate-600'
          }`}>
            <p className="text-sm">
              Built with ❤️ for word enthusiasts everywhere
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;