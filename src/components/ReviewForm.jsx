import React, { useState, useContext } from 'react';
import { Star } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ roomId, onReviewSubmitted }) => {
    const { axios, user } = useContext(AppContext);
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }
        if (!comment.trim()) {
            toast.error("Please write a review");
            return;
        }

        setIsSubmitting(true);
        try {
            const { data } = await axios.post("/api/reviews/add", {
                roomId,
                rating,
                comment,
                userId: user._id
            });

            if (data.success) {
                toast.success(data.message);
                setRating(0);
                setComment("");
                if (onReviewSubmitted) onReviewSubmitted();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-8">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Write a Review</h3>
            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Star Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                type="button"
                                key={star}
                                className="focus:outline-none transition-transform hover:scale-110"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(rating)}
                            >
                                <Star
                                    size={28}
                                    className={`${star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Review Text */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
                    <textarea
                        rows="4"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your thoughts about your stay..."
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-gray-700 resize-none bg-gray-50"
                    />
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                </button>
            </form>
        </div>
    );
};

export default ReviewForm;
