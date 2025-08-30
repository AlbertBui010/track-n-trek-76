import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { gpxContent } = await req.json();
    
    if (!gpxContent) {
      throw new Error('GPX content is required');
    }

    // Parse GPX XML content
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxContent, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid GPX file format');
    }

    // Extract track points
    const trackPoints = Array.from(xmlDoc.querySelectorAll('trkpt'));
    
    if (trackPoints.length === 0) {
      throw new Error('No track points found in GPX file');
    }

    let totalDistance = 0;
    let totalElevationGain = 0;
    let startTime: Date | null = null;
    let endTime: Date | null = null;
    const coordinates: Array<[number, number]> = [];

    // Process track points
    for (let i = 0; i < trackPoints.length; i++) {
      const point = trackPoints[i];
      const lat = parseFloat(point.getAttribute('lat') || '0');
      const lon = parseFloat(point.getAttribute('lon') || '0');
      const eleElement = point.querySelector('ele');
      const timeElement = point.querySelector('time');
      
      coordinates.push([lat, lon]);
      
      // Calculate distance between consecutive points
      if (i > 0) {
        const prevPoint = trackPoints[i - 1];
        const prevLat = parseFloat(prevPoint.getAttribute('lat') || '0');
        const prevLon = parseFloat(prevPoint.getAttribute('lon') || '0');
        
        totalDistance += calculateDistance(prevLat, prevLon, lat, lon);
      }
      
      // Calculate elevation gain
      if (eleElement && i > 0) {
        const elevation = parseFloat(eleElement.textContent || '0');
        const prevEleElement = trackPoints[i - 1].querySelector('ele');
        if (prevEleElement) {
          const prevElevation = parseFloat(prevEleElement.textContent || '0');
          const elevationDiff = elevation - prevElevation;
          if (elevationDiff > 0) {
            totalElevationGain += elevationDiff;
          }
        }
      }
      
      // Track time
      if (timeElement) {
        const timeValue = new Date(timeElement.textContent || '');
        if (!startTime || timeValue < startTime) {
          startTime = timeValue;
        }
        if (!endTime || timeValue > endTime) {
          endTime = timeValue;
        }
      }
    }

    // Calculate duration and pace
    let duration = 0;
    let pace = 0;
    
    if (startTime && endTime) {
      duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000);
      if (totalDistance > 0) {
        pace = (duration / 60) / totalDistance; // minutes per km
      }
    }

    const result = {
      distance: Math.round(totalDistance * 100) / 100, // Round to 2 decimal places
      duration,
      pace: Math.round(pace * 100) / 100,
      elevationGain: Math.round(totalElevationGain * 100) / 100,
      coordinates,
      startTime: startTime?.toISOString(),
      endTime: endTime?.toISOString(),
      trackPointsCount: trackPoints.length,
    };

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error parsing GPX:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

// Haversine formula to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}