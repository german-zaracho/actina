import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import HeaderAt from '../components/layout/HeaderAt.jsx';
import { getAutocompleteSuggestions, searchActivities } from '../services/searchService.js';
import '../css/home-search.css';

export default function Home() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [searchResults, setSearchResults] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isSearching, setIsSearching] = useState(false);
    const [showFilters, setShowFilters] = useState(false);

    // Filtros de tipo
    const [filters, setFilters] = useState({
        multiplechoice: true,
        flashcard: true,
        atlas: true
    });

    const searchRef = useRef(null);
    const debounceTimer = useRef(null);

    // Cerrar sugerencias al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Obtiene sugerencias
    useEffect(() => {
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        if (searchQuery.trim().length >= 2) {
            debounceTimer.current = setTimeout(async () => {
                try {
                    const activeFilters = Object.keys(filters).filter(key => filters[key]);
                    const results = await getAutocompleteSuggestions(searchQuery.trim(), activeFilters);
                    setSuggestions(results);
                    setShowSuggestions(true);
                } catch (err) {
                    console.error('Error obteniendo sugerencias:', err);
                    setSuggestions([]);
                }
            }, 300);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }

        return () => {
            if (debounceTimer.current) {
                clearTimeout(debounceTimer.current);
            }
        };
    }, [searchQuery, filters]);

    // Maneja la búsqueda
    const handleSearch = async (query = searchQuery) => {
        if (!query || query.trim().length < 2) return;

        setIsSearching(true);
        setShowSuggestions(false);

        try {
            const activeFilters = Object.keys(filters).filter(key => filters[key]);
            const results = await searchActivities(query.trim(), activeFilters);
            setSearchResults(results);
        } catch (err) {
            console.error('Error en búsqueda:', err);
        } finally {
            setIsSearching(false);
        }
    };

    // Maneja el enter
    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < suggestions.length - 1 ? prev + 1 : prev
            );
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                const selectedSuggestion = suggestions[selectedIndex];
                setSearchQuery(selectedSuggestion);
                handleSearch(selectedSuggestion);
            } else {
                handleSearch();
            }
        } else if (e.key === 'Escape') {
            setShowSuggestions(false);
            setSelectedIndex(-1);
        }
    };

    // Selecciona la sugerencia
    const handleSuggestionClick = (suggestion) => {
        setSearchQuery(suggestion);
        handleSearch(suggestion);
    };

    // Toggle filtros
    const toggleFilter = (filterKey) => {
        setFilters(prev => ({
            ...prev,
            [filterKey]: !prev[filterKey]
        }));
    };

    // Navega a resultado
    const handleResultClick = (result) => {
        switch (result.type) {
            case 'multiplechoice':
                navigate(`/multiplechoiceQuestions/${result.classification}`);
                break;
            case 'flashcard':
                navigate(`/flashcardTabs/${result.subject}`);
                break;
            case 'atlas':
                navigate(`/atlasPages/${result.subject}`);
                break;
        }
    };

    // Limpiar búsqueda
    const handleClear = () => {
        setSearchQuery('');
        setSearchResults(null);
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
    };

    const getTotalResults = () => {
        if (!searchResults) return 0;
        return (searchResults.multiplechoices?.length || 0) +
            (searchResults.flashcards?.length || 0) +
            (searchResults.atlas?.length || 0);
    };

    // Normaliza texto removiendo acentos
    const normalizeText = (text) => {
        return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    };

    function renderHighlightedText(text, matchedTerms = [], query = searchQuery) {
        if (!text) return text;

        const allTermsToHighlight = new Set();

        // Agrega términos extraídos del backend
        matchedTerms.forEach(term => {
            if (term && term.length >= 2) {
                allTermsToHighlight.add(term);
            }
        });

        // Agrega el query original
        if (query && query.trim().length >= 2) {
            allTermsToHighlight.add(query.trim());
        }

        // Si no hay términos, buscar el query dentro del texto
        if (allTermsToHighlight.size === 0 && query && query.trim().length >= 2) {
            const queryNorm = normalizeText(query.trim().toLowerCase());
            const textNorm = normalizeText(text.toLowerCase());

            // Si el texto contiene el query, agregarlo
            if (textNorm.includes(queryNorm)) {
                allTermsToHighlight.add(query.trim());
            }
        }

        const terms = Array.from(allTermsToHighlight)
            .filter(t => t && t.length >= 2)
            .sort((a, b) => b.length - a.length);

        if (terms.length === 0) return text;

        const escapedTerms = terms.map(t =>
            t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );

        // Crear regex única con todos los términos
        const regex = new RegExp(`(${escapedTerms.join('|')})`, 'gi');

        // Split + map
        const parts = text.split(regex);

        return parts.map((part, i) => {
            // Verificar si esta parte coincide con algún término (ignorando acentos)
            const partNormalized = normalizeText(part.toLowerCase());
            const isMatch = terms.some(term => {
                const termNormalized = normalizeText(term.toLowerCase());
                return partNormalized === termNormalized ||
                    partNormalized.includes(termNormalized) ||
                    termNormalized.includes(partNormalized);
            });

            return isMatch ? (
                <mark key={i} className="highlight-match">{part}</mark>
            ) : (
                part
            );
        });
    }

    return (
        <>
            <HeaderAt />
            <div className='divContainer'>
                <Sidebar />
                <div className='container'>
                    <div className='homeSection'>
                        <h2 className='searchTitle'>Hola, Bienvenid@!</h2>

                        {/* Buscador con Autocomplete */}
                        <div className='searchContainer' ref={searchRef}>
                            <div className='searchField'>
                                <span className="material-icons searchIcon">search</span>
                                <input
                                    type="text"
                                    placeholder='Buscar en multiplechoice, flashcards, atlas...'
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (suggestions.length > 0) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                />

                                {searchQuery && (
                                    <button
                                        className="clearButton"
                                        onClick={handleClear}
                                        title="Limpiar búsqueda"
                                    >
                                        <span className="material-icons">close</span>
                                    </button>
                                )}

                                <button
                                    className="filterButton"
                                    onClick={() => setShowFilters(!showFilters)}
                                    title="Filtros de búsqueda"
                                >
                                    <span className="material-icons">filter_list</span>
                                </button>
                            </div>

                            {/* Menú de Filtros */}
                            {showFilters && (
                                <div className="filtersMenu">
                                    <h4>Buscar en:</h4>
                                    <label className="filterOption">
                                        <input
                                            type="checkbox"
                                            checked={filters.multiplechoice}
                                            onChange={() => toggleFilter('multiplechoice')}
                                        />
                                        <span>Multiple Choice</span>
                                    </label>
                                    <label className="filterOption">
                                        <input
                                            type="checkbox"
                                            checked={filters.flashcard}
                                            onChange={() => toggleFilter('flashcard')}
                                        />
                                        <span>Flashcards</span>
                                    </label>
                                    <label className="filterOption">
                                        <input
                                            type="checkbox"
                                            checked={filters.atlas}
                                            onChange={() => toggleFilter('atlas')}
                                        />
                                        <span>Atlas</span>
                                    </label>
                                </div>
                            )}

                            {/* Sugerencias de Autocomplete */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div className="suggestionsDropdown">
                                    {suggestions.map((suggestion, index) => (
                                        <div
                                            key={index}
                                            className={`suggestionItem ${index === selectedIndex ? 'selected' : ''}`}
                                            onClick={() => handleSuggestionClick(suggestion)}
                                            onMouseEnter={() => setSelectedIndex(index)}
                                        >
                                            <span className="material-icons suggestionIcon">search</span>
                                            <span className="suggestionText">{suggestion}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Resultados de Búsqueda */}
                        {isSearching && (
                            <div className="searchingIndicator">
                                <span className="material-icons spinning">refresh</span>
                                <p>Buscando...</p>
                            </div>
                        )}

                        {searchResults && !isSearching && (
                            <div className="searchResults">
                                <h3>Resultados ({getTotalResults()})</h3>

                                {/* Multiplechoice */}
                                {searchResults.multiplechoices && searchResults.multiplechoices.length > 0 && (
                                    <div className="resultsSection">
                                        <h4>
                                            <span className="material-icons">quiz</span>
                                            Multiple Choice ({searchResults.multiplechoices.length})
                                        </h4>
                                        <div className="resultsList">
                                            {searchResults.multiplechoices.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="resultCard"
                                                    onClick={() => handleResultClick(item)}
                                                >
                                                    <h5>
                                                        {renderHighlightedText(item.subject, item.matchedTerms, searchQuery)}
                                                    </h5>
                                                    <p>
                                                        {renderHighlightedText(item.classification, item.matchedTerms, searchQuery)}
                                                    </p>
                                                    <span className="resultMeta">
                                                        {item.questions?.length || 0} preguntas
                                                        {(() => {
                                                            const termsToShow = (item.matchedTerms && item.matchedTerms.length > 0)
                                                                ? item.matchedTerms
                                                                : [searchQuery.trim()];
                                                            return (
                                                                <span className="matchInfo">
                                                                    {' • '}
                                                                    {termsToShow.map((term, idx) => (
                                                                        <span key={idx} className="matchedTerm">
                                                                            {term}{idx < termsToShow.length - 1 ? ', ' : ''}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            );
                                                        })()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Flashcards */}
                                {searchResults.flashcards && searchResults.flashcards.length > 0 && (
                                    <div className="resultsSection">
                                        <h4>
                                            <span className="material-icons">style</span>
                                            Flashcards ({searchResults.flashcards.length})
                                        </h4>
                                        <div className="resultsList">
                                            {searchResults.flashcards.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="resultCard"
                                                    onClick={() => handleResultClick(item)}
                                                >
                                                    <h5>
                                                        {renderHighlightedText(item.subject, item.matchedTerms, searchQuery)}
                                                    </h5>
                                                    <p>
                                                        {renderHighlightedText(item.topic, item.matchedTerms, searchQuery)}
                                                    </p>
                                                    <span className="resultMeta">
                                                        {item.tabs?.length || 0} tabs
                                                        {(() => {
                                                            const termsToShow = (item.matchedTerms && item.matchedTerms.length > 0)
                                                                ? item.matchedTerms
                                                                : [searchQuery.trim()];
                                                            return (
                                                                <span className="matchInfo">
                                                                    {' • '}
                                                                    {termsToShow.map((term, idx) => (
                                                                        <span key={idx} className="matchedTerm">
                                                                            {term}{idx < termsToShow.length - 1 ? ', ' : ''}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            );
                                                        })()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Atlas */}
                                {searchResults.atlas && searchResults.atlas.length > 0 && (
                                    <div className="resultsSection">
                                        <h4>
                                            <span className="material-icons">map</span>
                                            Atlas ({searchResults.atlas.length})
                                        </h4>
                                        <div className="resultsList">
                                            {searchResults.atlas.map((item) => (
                                                <div
                                                    key={item._id}
                                                    className="resultCard"
                                                    onClick={() => handleResultClick(item)}
                                                >
                                                    <h5>
                                                        {renderHighlightedText(item.subject, item.matchedTerms, searchQuery)}
                                                    </h5>
                                                    <p>
                                                        {renderHighlightedText(item.type, item.matchedTerms, searchQuery)}
                                                    </p>
                                                    <span className="resultMeta">
                                                        {item.pages?.length || 0} páginas
                                                        {(() => {
                                                            const termsToShow = (item.matchedTerms && item.matchedTerms.length > 0)
                                                                ? item.matchedTerms
                                                                : [searchQuery.trim()];
                                                            return (
                                                                <span className="matchInfo">
                                                                    {' • '}
                                                                    {termsToShow.map((term, idx) => (
                                                                        <span key={idx} className="matchedTerm">
                                                                            {term}{idx < termsToShow.length - 1 ? ', ' : ''}
                                                                        </span>
                                                                    ))}
                                                                </span>
                                                            );
                                                        })()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {getTotalResults() === 0 && (
                                    <div className="noResults">
                                        <span className="material-icons">search_off</span>
                                        <p>No se encontraron resultados para "{searchQuery}"</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}