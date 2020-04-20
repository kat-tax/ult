/**
 * lodashMini.ts
 *
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT license.
 *
 * Imports a subset of lodash library needed for ReactXP's implementation.
 */

import assign = require('lodash/assign');
import clone = require('lodash/clone');
import cloneDeep = require('lodash/cloneDeep');
import flatten = require('lodash/flatten');
import get = require('lodash/get');
import isEmpty = require('lodash/isEmpty');
import isEqual = require('lodash/isEqual');
import isNumber = require('lodash/isNumber');
import map = require('lodash/map');
import mapValues = require('lodash/mapValues');

export interface Dictionary<T> {
    [index: string]: T;
}

export {
    assign,
    clone,
    cloneDeep,
    flatten,
    get,
    isEmpty,
    isEqual,
    isNumber,
    map,
    mapValues,
};
