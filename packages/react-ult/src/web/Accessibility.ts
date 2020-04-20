/**
 * Accessibility.ts
 *
 * Web wrapper for subscribing or querying the current state of the
 * screen reader.
 */

import { Accessibility as CommonAccessibility } from '../common/Accessibility';

export class Accessibility extends CommonAccessibility {
    // Calling this API on web has no effect.
    isScreenReaderEnabled(): boolean {
        return false;
    }
}

export default new Accessibility();
