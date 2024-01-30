/**
 * Get values via random walk from a starting value and given volatility
 * @param startingValue
 * @param volatility - Percentage as decimal where 0.02 is relatively stable, 0.1 is volatile
 * @param size - Number of values to return
 */
export function getValues(
  startingValue: number,
  volatility: number,
  count: number
) {
  return Array(count - 1)
    .fill(0)
    .reduce<number[]>(
      (values, _, index) => [
        ...values,
        Number(
          (
            values[index] *
            (1 + 2 * volatility * (Math.random() - 0.5))
          ).toFixed(2)
        ),
      ],
      [startingValue]
    );
}
