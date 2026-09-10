import React, { useState } from 'react';
import { X, Star, Check, Sparkles } from 'lucide-react';
import { BazaarWithComputedDistance } from '../types';

interface AddReviewModalProps {
  bazaar: BazaarWithComputedDistance | null;
  onClose: () => void;
  onSubmitReview: (
    bazaarId: string,
    reviewData: {
      author: string;
      rating: number;
      comment: string;
      tags: string[];
    }
  ) => void;
}

const AVAILABLE_TAGS = [
  'Fresh Groceries',
  'Quality Textiles',
  'Delicious Street Food',
  'Easy Parking',
  'Friendly Vendors',
  'Great Bargains',
  'Historic Atmosphere',
];

export const AddReviewModal: React.FC<AddReviewModalProps> = ({
  bazaar,
  onClose,
  onSubmitReview,
}) => {
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Fresh Groceries',
    'Easy Parking',
  ]);
  const [error, setError] = useState('');

  if (!bazaar) return null;

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!comment.trim()) {
      setError('Please write a short review comment');
      return;
    }
    onSubmitReview(bazaar.id, {
      author: author.trim(),
      rating,
      comment: comment.trim(),
      tags: selectedTags,
    });
    onClose();
  };

  const getRatingLabel = (r: number) => {
    switch (r) {
      case 5:
        return 'Outstanding (5/5)';
      case 4:
        return 'Very Good (4/5)';
      case 3:
        return 'Average (3/5)';
      case 2:
        return 'Poor (2/5)';
      default:
        return 'Terrible (1/5)';
    }
  };

  return (
    <div
      id="add-review-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-200"
    >
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-slate-800/80 px-5 py-4 border-b border-slate-700 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-orange-400 block">
              User Rating & Review
            </span>
            <h3 className="font-bold text-white text-base truncate max-w-[260px]">
              {bazaar.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {error && (
            <div className="bg-rose-950/40 border border-rose-500/50 text-rose-300 p-2.5 rounded-xl text-xs">
              {error}
            </div>
          )}

          {/* Rating stars */}
          <div className="text-center space-y-1.5 py-1">
            <div className="text-slate-300 font-semibold text-xs">
              Select Your Rating:
            </div>
            <div className="flex items-center justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform active:scale-125"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        active
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-600 hover:text-slate-500'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <div className="text-amber-400 font-bold text-xs">
              {getRatingLabel(hoverRating || rating)}
            </div>
          </div>

          {/* Name input */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">
              Your Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Canan Demir"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs"
            />
          </div>

          {/* Features experienced tags */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-300 block">
              Features Experienced (Groceries, Textiles, Food, Parking):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all flex items-center gap-1 border ${
                      isSelected
                        ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Review comment */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-300 block">
              Your Review & Tips (Parking, Food, Textiles, Prices):
            </label>
            <textarea
              rows={3}
              placeholder="Share what you bought, how the parking was, or your favorite food stalls..."
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                setError('');
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 text-xs resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Submit Review</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
