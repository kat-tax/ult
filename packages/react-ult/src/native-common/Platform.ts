/**
 * Platform.ts
 *
 * Native implementation of Platform interface.
 */

import * as RN from 'react-native';

import * as Ult from '../common/Interfaces';

export class Platform extends Ult.Platform {
    getType(): Ult.Types.PlatformType {
        return RN.Platform.OS;
    }

    select<T>(specifics: { [ platform in Ult.Types.PlatformType | 'default' ]?: T }): T | undefined {
        const platformType = this.getType();
        return platformType in specifics ? specifics[platformType] : specifics.default;
    }
}

export default new Platform();
