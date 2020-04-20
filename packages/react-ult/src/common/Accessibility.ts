/**
 * Accessibility.ts
 *
 * Common wrapper for accessibility helper exposed from ULT.
 */

import SubscribableEvent from 'subscribableevent';

import * as RX from '../common/Interfaces';

export abstract class Accessibility extends RX.Accessibility {
    abstract isScreenReaderEnabled(): boolean;

    screenReaderChangedEvent = new SubscribableEvent<(isEnabled: boolean) => void>();

    isHighContrastEnabled(): boolean {
        return false;
    }

    newAnnouncementReadyEvent = new SubscribableEvent<(announcement: string) => void>();
    announceForAccessibility(announcement: string): void {
        this.newAnnouncementReadyEvent.fire(announcement);
    }
}

export default Accessibility;
