import {isEven} from './exampletesting.component';
it('is the given numer is even', () => {
  const result = isEven(2);
  expect(result).toBe(false);
});
 