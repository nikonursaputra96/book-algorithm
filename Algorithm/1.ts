function reverseJoin(input: string): string {
    let letters = [];
    let numbers = [];

    for (let i = 0; i < input.length; i++) {
        if (/[a-zA-Z]/.test(input[i])) {
            letters.push(input[i]);
        } else {
            numbers.push(input[i]);
        }
    }

    return letters.reverse().join('') + numbers.join('');
}

console.log(reverseJoin("NEGIE1"));