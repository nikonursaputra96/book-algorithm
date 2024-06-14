function countLength(input: string[], query: string[]): number[] {
    const length: number[] = [];

    for (let i = 0; i < query.length; i++) {
        let count = 0;
        for (let j = 0; j < input.length; j++) {
            if (input[j] === query[i]) {
                count++;
            }
        }
        length.push(count);
    }

    return length;
}

const input = ['xc', 'dz', 'bbb', 'dz'];
const query = ['bbb', 'ac', 'dz'];
console.log(countLength(input, query));