function sentence(char: string): string {
    const word = char.split(' ')
    let longest = ''

    for (let i = 0; i < word.length; i++) {
        const wordFirst = word[i]
        if (wordFirst.length > longest.length) {
            longest = wordFirst
        }
    }
    return `${longest}: ${longest.length} character `
}

console.log(sentence("Saya sangat senang mengerjakan soal algoritma"))