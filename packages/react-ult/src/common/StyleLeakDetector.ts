/**
 * StyleLeakDetector.ts
 *
 * Detects style memory-leaks in react-native.
 * To fix warning use not cached styles by providing:
 * cacheStyle == false to Style.create... method
 */

import AppConfig from './AppConfig';
import { Types } from './Interfaces';
import { Dictionary, sortBy } from './lodashMini';

export class StyleLeakDetector {
    private _fingerprintRegistry: {[key: string]: string} = {};

    private _getFingerprint<T extends Types.ViewAndImageCommonStyle>(object: T): string {
        return JSON.stringify(this._sortAny(object));
    }

    /**
     * We need to sort objects before using JSON.stringify as otherwise objects
     * {a: 1, b: 2} and {b: 2, a: 1} would have a different fingerprints
     */
    private _sortAny(object: any): any {
        if (object instanceof Array) {
            return this._sortArray(object);
        } else if (object instanceof Object) {
            return this._sortObject(object);
        } else {
            return object;
        }
    }

    private _sortObject(object: Dictionary<any>): Dictionary<any> {
        const result: Dictionary<any> = {};
        let keys: string [] = [];
        for (const key in object) {
            if (object.hasOwnProperty(key)) {
                keys.push(key);
            }
        }

        keys = sortBy(keys);
        const keysLength = keys.length;
        for (let i = 0; i < keysLength; i++) {
            const key: any = keys[i];
            const value: any = object[key];
            result[key] = this._sortAny(value);
        }

        return result;
    }

    private _sortArray(object: any[]): any[] {
        const length = object.length;
        for (let i = 0; i < length; i++) {
            object[i] = this._sortAny(object[i]);
        }

        return object;
    }

    protected isDisabled(): boolean {
        return false;
    }

    detectLeaks<T extends Types.ViewAndImageCommonStyle>(style: T): void {
        if (AppConfig.isDevelopmentMode() && !this.isDisabled()) {
            const error: any = new Error();
            // we detect leaks on chrome and firefox only, other browser have now this member
            const stack = error.stack;
            if (stack) {
                const styleAllocationId = stack.toString() + this._getFingerprint(style);
                const firstAllocation = this._fingerprintRegistry[styleAllocationId];
                if (firstAllocation) {
                    console.warn('Possible style leak of: ', style, 'first allocation: ', firstAllocation);
                } else {
                    this._fingerprintRegistry[styleAllocationId] = stack;
                }
            }
        }
    }
}

export default new StyleLeakDetector();
