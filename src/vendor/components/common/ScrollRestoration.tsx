import { useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollRestoration Component
 * 
 * Manages scroll behavior for navigation:
 * - List to Detail: Scrolls to top
 * - Detail to List (back): Restores previous scroll position
 */

// Store scroll positions for list pages
const scrollPositions = new Map<string, number>();

export function ScrollRestoration() {
  const location = useLocation();
  const previousLocationRef = useRef<string | null>(null);
  const isNavigatingBackRef = useRef(false);

  useLayoutEffect(() => {
    const currentPath = location.pathname;
    const previousPath = previousLocationRef.current;

    // Determine if current page is a detail page
    const isDetailPage = (path: string) => {
      return (
        path.match(/\/vendor\/orders\/[^/]+$/) || // Order details
        path.match(/\/vendor\/payouts\/[^/]+$/) || // Payout details
        path.match(/\/vendor\/support\/tickets\/[^/]+$/) // Ticket details
      );
    };

    // Determine if current page is a list page
    const isListPage = (path: string) => {
      return (
        path === '/vendor/orders' ||
        path === '/vendor/payouts' ||
        path === '/vendor/support/tickets'
      );
    };

    // Handle initial load (no previous path)
    if (previousPath === null) {
      previousLocationRef.current = currentPath;
      return;
    }

    const wasOnDetailPage = isDetailPage(previousPath);
    const isOnListPage = isListPage(currentPath);
    const isOnDetailPage = isDetailPage(currentPath);

    // Navigating from list to detail
    if (isOnDetailPage) {
      // Save current scroll position if coming from list
      if (isListPage(previousPath)) {
        scrollPositions.set(previousPath, window.scrollY);
      }
      // Scroll to top when entering detail page
      window.scrollTo(0, 0);
      isNavigatingBackRef.current = false;
    }
    // Navigating from detail back to list
    else if (wasOnDetailPage && isOnListPage) {
      // Restore scroll position
      const savedPosition = scrollPositions.get(currentPath);
      if (savedPosition !== undefined) {
        window.scrollTo(0, savedPosition);
      } else {
        window.scrollTo(0, 0);
      }
      isNavigatingBackRef.current = true;
    }
    // Navigating to any other page
    else if (!isOnListPage || !isNavigatingBackRef.current) {
      window.scrollTo(0, 0);
      isNavigatingBackRef.current = false;
    }

    // Update previous location
    previousLocationRef.current = currentPath;
  }, [location.pathname]);

  return null;
}