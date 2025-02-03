// frontend/pages/search.js
import Head from 'next/head';
import { useState, useEffect } from 'react';
import styles from '../styles/Search.module.css';

export default function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');
  const [recommendedPapers, setRecommendedPapers] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  useEffect(() => {
    fetchRecommendedPapers();
  }, []);

  async function fetchRecommendedPapers() {
    try {
      const response = await fetch('http://localhost:3000/search/recommended');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecommendedPapers(data.results || []);
    } catch (error) {
      console.error('Error fetching recommended papers:', error);
    }
  }

  async function searchPapers() {
    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setMessage('Please enter a keyword to search');
      setResults([]);
      return;
    }

    setMessage('Searching...');
    setShowSearchResults(true);

    try {
      const response = await fetch(`http://localhost:3000/search?query=${encodeURIComponent(trimmedQuery)}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setMessage('No results found');
        setResults([]);
      } else {
        setMessage('');
        setResults(data.results);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage('Failed to search papers, please try again later');
      setResults([]);
    }
  }

  function formatReviewStatus(reviewStatuses) {
    if (!reviewStatuses) return 'No reviewers yet';
    const statuses = reviewStatuses.split(',').map(s => s.trim());
    if (statuses.includes('submitted')) return 'At least one reviewer has submitted';
    if (statuses.includes('accepted') || statuses.includes('invited')) return `In review (${reviewStatuses})`;
    return reviewStatuses;
  }

  return (
    <>
      <Head>
        <title>Dexiv</title>
      </Head>

      <h1 className={styles.title}>Dexiv</h1>
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter keyword to search"
          className={styles.input}
        />
        <button onClick={searchPapers} className={styles.button}>Search</button>
      </div>

      {showSearchResults ? (
        <div className={styles.results}>
          {message && (
            <div className={styles.noResults}>{message}</div>
          )}
          
          {results.map((paper, index) => (
            <div key={index} className={styles.resultItem}>
              <h3>{paper.title}</h3>
              <p><strong>Authors:</strong> {paper.authors}</p>
              <p><strong>Abstract:</strong> {paper.abstract}</p>
              <p><strong>Keywords:</strong> {paper.keywords}</p>
              <p><strong>Review Status:</strong> {formatReviewStatus(paper.reviewStatuses)}</p>
              <small><strong>Time:</strong> {paper.timestamp}</small>
              <br />
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${paper.DID}`} 
                target="_blank" 
                rel="noreferrer"
                className={styles.viewLink}
              >
                View PDF
              </a>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.recommendedPapers}>
          <h2 className={styles.recommendedTitle}>Recommended Papers</h2>
          {recommendedPapers.map((paper, index) => (
            <div key={index} className={styles.resultItem}>
              <h3>{paper.title}</h3>
              <p><strong>Authors:</strong> {paper.authors}</p>
              <p><strong>Abstract:</strong> {paper.abstract}</p>
              <p><strong>Keywords:</strong> {paper.keywords}</p>
              <p><strong>Review Status:</strong> {formatReviewStatus(paper.reviewStatuses)}</p>
              <small><strong>Time:</strong> {paper.timestamp}</small>
              <br />
              <a 
                href={`https://gateway.pinata.cloud/ipfs/${paper.DID}`} 
                target="_blank" 
                rel="noreferrer"
                className={styles.viewLink}
              >
                View PDF
              </a>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
