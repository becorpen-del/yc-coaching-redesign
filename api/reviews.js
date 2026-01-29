const axios = require('axios');

module.exports = async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
    const PLACE_ID = process.env.PLACE_ID;

    if (!GOOGLE_API_KEY || !PLACE_ID) {
        return res.status(500).json({
            success: false,
            error: 'Configuration manquante (GOOGLE_API_KEY ou PLACE_ID)'
        });
    }

    try {
        const googleUrl = 'https://maps.googleapis.com/maps/api/place/details/json';
        const response = await axios.get(googleUrl, {
            params: {
                place_id: PLACE_ID,
                fields: 'name,rating,reviews,user_ratings_total,url',
                key: GOOGLE_API_KEY,
                language: 'fr'
            }
        });

        if (response.data.status !== 'OK') {
            return res.status(400).json({
                success: false,
                error: 'Erreur Google API',
                googleStatus: response.data.status
            });
        }

        const placeData = response.data.result;
        const formattedData = {
            name: placeData.name,
            rating: placeData.rating,
            totalReviews: placeData.user_ratings_total,
            url: placeData.url,
            reviews: (placeData.reviews || []).map(review => ({
                author_name: review.author_name,
                rating: review.rating,
                text: review.text,
                time: review.time,
                profile_photo_url: review.profile_photo_url || null
            }))
        };

        // Cache CDN Vercel : 1h cache, 5min stale-while-revalidate
        res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=300');

        return res.status(200).json({
            success: true,
            source: 'api',
            data: formattedData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: 'Erreur serveur',
            message: error.message
        });
    }
};
