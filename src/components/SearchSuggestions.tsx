import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { products } from '../data/products';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  onClose: () => void;
  isVisible: boolean;
}

const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({
  query,
  onSuggestionClick,
  onClose,
  isVisible
}) => {
  const [suggestions, setSuggestions] = useState<{
    products: typeof products;
    categories: string[];
    tags: string[];
  }>({ products: [], categories: [], tags: [] });
  
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setSuggestions({ products: [], categories: [], tags: [] });
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Find matching products
    const matchingProducts = products.filter(product => {
      const searchableText = [
        product.name,
        product.description,
        product.category,
        product.subcategory || '',
        ...product.tags,
        ...product.benefits,
        ...product.ingredients
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm) ||
             product.name.toLowerCase().includes(searchTerm);
    }).slice(0, 5); // Limit to 5 products

    // Find matching categories
    const categorySet = new Set(products.map(p => p.category));
    const allCategories = Array.from(categorySet);
    const matchingCategories = allCategories.filter(category =>
      category.toLowerCase().includes(searchTerm)
    ).slice(0, 3);

    // Find matching tags
    const tagSet = new Set(products.flatMap(p => p.tags));
    const allTags = Array.from(tagSet);
    const matchingTags = allTags.filter(tag =>
      tag.toLowerCase().includes(searchTerm)
    ).slice(0, 5);

    setSuggestions({
      products: matchingProducts,
      categories: matchingCategories,
      tags: matchingTags
    });
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isVisible, onClose]);

  if (!isVisible || !query.trim() || query.length < 2) {
    return null;
  }

  const hasResults = suggestions.products.length > 0 || 
                    suggestions.categories.length > 0 || 
                    suggestions.tags.length > 0;

  return (
    <div
      ref={suggestionsRef}
      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
    >
      {hasResults ? (
        <div className="py-2">
          {/* Product Suggestions */}
          {suggestions.products.length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                Products
              </div>
              {suggestions.products.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.id}`}
                  className="flex items-center px-4 py-3 hover:bg-primary-50 transition-colors"
                  onClick={onClose}
                >
                  <img
                    src={product.images[0] || '/images/products/default.png'}
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded-md mr-3"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {product.category}
                    </div>
                  </div>
                  <div className="text-sm font-semibold text-primary-600">
                    ₦{product.price.toLocaleString()}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Category Suggestions */}
          {suggestions.categories.length > 0 && (
            <div className="mb-2">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                Categories
              </div>
              {suggestions.categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    onSuggestionClick(category);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-primary-50 transition-colors flex items-center"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700">{category}</span>
                </button>
              ))}
            </div>
          )}

          {/* Tag Suggestions */}
          {suggestions.tags.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b">
                Popular Searches
              </div>
              {suggestions.tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    onSuggestionClick(tag);
                    onClose();
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-primary-50 transition-colors flex items-center"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400 mr-3" />
                  <span className="text-sm text-gray-700 capitalize">
                    {tag.replace('-', ' ')}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="px-4 py-6 text-center text-gray-500">
          <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <div className="text-sm">No suggestions found for "{query}"</div>
          <div className="text-xs mt-1">Try searching for "kuli-kuli", "groundnut oil", or "bags"</div>
        </div>
      )}
    </div>
  );
};

export default SearchSuggestions;
