import React, { useCallback, useEffect, useState, useContext } from 'react';
import { Star, User } from 'lucide-react';
import { AppContext } from '../context/AppContext';
import ReviewForm from './ReviewForm';

const ReviewSection = ({ roomId }) => {
    const { axios, user } = useContext(AppContext);
    const [reviews, setReviews] = useState([]);
    const [canReview, setCanReview] = useState(false);

    const fetchReviews = useCallback(async () => {
        try {
            const { data } = await axios.get(`/api/reviews/get/${roomId}`);
            if (data.success) {
                setReviews(data.reviews);
            }
        } catch (error) {
            console.error("Failed to fetch reviews", error);
        }
    }, [axios, roomId]);

    const checkEligibility = useCallback(async () => {
        if (!user) return;
        try {
            const { data } = await axios.get(`/api/reviews/check-eligibility/${roomId}`);
            if (data.success) {
                setCanReview(data.canReview);
            }
        } catch (error) {
            console.error("Failed to check eligibility", error);
        }
    }, [axios, roomId, user]);

    useEffect(() => {
        Promise.all([fetchReviews(), checkEligibility()]);
    }, [fetchReviews, checkEligibility]);

    // Calculate Average Rating
    const averageRating = reviews.length > 0
        ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
        : "New";

    return (
        <div className="space-y-8">

            {/* Reviews Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-8 border-b border-gray-100 pb-6">
                    <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl text-primary font-bold text-2xl">
                        {averageRating}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Guest Reviews</h2>
                        <p className="text-gray-500">{reviews.length} verified reviews</p>
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-6">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review._id} className="bg-gray-50 p-6 rounded-2xl">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{review.userName}</h4>
                                            <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">
                                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                        <span className="font-bold text-sm text-gray-700">{review.rating}</span>
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            No reviews yet. Be the first to share your experience!
                        </div>
                    )}
                </div>
            </div>

            {/* Review Form - Only if Eligible */}
            {canReview && (
                <ReviewForm
                    roomId={roomId}
                    onReviewSubmitted={() => {
                        fetchReviews();
                        setCanReview(false); // Hide form after submission
                    }}
                />
            )}
        </div>
    );
};

export default ReviewSection;
