import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchPage.css';

function SearchPage() {
  const { user } = useAppContext(); // logged-in user info if needed
  const navigate = useNavigate();

  // Search filters
  const [searchQuery, setSearchQuery] = useState('');
  const [ageRange, setAgeRange] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
  const conditions = ['New', 'Like New', 'Older'];

  // Fetch all products initially
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${urlConfig.backendUrl}/api/products`);
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error('Fetch error:', error.message);
      }
    };
    fetchProducts();
  }, []);

  // Handle search button click
  const handleSearch = async () => {
    const baseUrl = `${urlConfig.backendUrl}/api/search?`;
    const queryParams = new URLSearchParams({
      name: searchQuery,
      age_years: ageRange,
      category: selectedCategory,
      condition: selectedCondition,
    }).toString();

    try {
      const response = await fetch(`${baseUrl}${queryParams}`);
      if (!response.ok) throw new Error('Search failed');
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Failed to fetch search results:', error);
    }
  };

  const goToDetailsPage = (productId) => navigate(`/app/product/${productId}`);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          {/* Filters Section */}
          <div className="filter-section mb-3 p-3 border rounded">
            <h5>Filters</h5>

            <label htmlFor="categorySelect">Category</label>
            <select
              id="categorySelect"
              className="form-control my-1"
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <label htmlFor="conditionSelect">Condition</label>
            <select
              id="conditionSelect"
              className="form-control my-1"
              value={selectedCondition}
              onChange={e => setSelectedCondition(e.target.value)}
            >
              <option value="">All</option>
              {conditions.map(condition => (
                <option key={condition} value={condition}>{condition}</option>
              ))}
            </select>

            <label htmlFor="ageRange">Less than {ageRange} years</label>
            <input
              type="range"
              className="form-control-range"
              id="ageRange"
              min="1"
              max="10"
              value={ageRange}
              onChange={e => setAgeRange(Number(e.target.value))}
            />
          </div>

          {/* Search Input */}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Search for items..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button className="btn btn-primary mb-3" onClick={handleSearch}>Search</button>

          {/* Search Results */}
          <div className="search-results mt-4">
            {searchResults.length > 0 ? (
              searchResults.map(product => (
                <div key={product.id} className="card mb-3">
                  <img
                    src={product.image || 'placeholder.png'}
                    alt={product.name}
                    className="card-img-top"
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="card-text">{product.description?.slice(0, 100)}...</p>
                  </div>
                  <div className="card-footer">
                    <button
                      onClick={() => goToDetailsPage(product.id)}
                      className="btn btn-primary"
                    >
                      View More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="alert alert-info" role="alert">
                No products found. Please revise your filters.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
