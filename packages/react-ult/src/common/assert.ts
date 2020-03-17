/**
 * assert
 *
 */
const assert = (cond: any, message?: string | undefined) => {
  if (!cond) {
    throw new Error(message || 'Assertion Failed');
  }
};

export default assert;
