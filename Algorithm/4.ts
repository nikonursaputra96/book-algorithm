function diagonal(matrix: number[][]): number {
    let first = 0;
    let second = 0;

    for (let i = 0; i < matrix.length; i++) {
        console.log(matrix[i][i])
        first += matrix[i][i];
        second += matrix[i][matrix.length - 1 - i];
    }

    return Math.abs(first - second);
}


const matrix = [
    [1, 2, 0],
    [4, 5, 6],
    [7, 8, 9]
];
console.log(diagonal(matrix));