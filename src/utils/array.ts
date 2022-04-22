const getIterationArray = (
    arrayLength: number,
    startNumber: number,
    step?: number
) =>
    Array.from({ length: arrayLength }, (_, i) =>
        step ? startNumber + step * (i + 1) : startNumber
    );

export { getIterationArray };
