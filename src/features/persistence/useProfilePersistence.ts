import { useEffect, useEffectEvent } from 'react';
import { defaultPageSize } from '@/domain/invoice/defaultPageSize';
import { saveStoredProfile } from '@/state/storage/saveStoredProfile';
import type { StoredProfile } from '@/state/storage/storedProfile';

const SAVE_DELAY_MS = 400;

/** Saves the sender's own details shortly after they stop changing, and on leaving the page. */
export function useProfilePersistence(profile: StoredProfile): void {
  const profileKey = JSON.stringify(profile);

  const saveLatest = useEffectEvent(() => {
    saveStoredProfile(profile, defaultPageSize(navigator.language));
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      saveLatest();
    }, SAVE_DELAY_MS);
    // A download records the invoice number; closing the tab within the delay must not lose it.
    function saveBeforeLeaving(): void {
      window.clearTimeout(timer);
      saveLatest();
    }
    window.addEventListener('pagehide', saveBeforeLeaving);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('pagehide', saveBeforeLeaving);
    };
  }, [profileKey]);
}
