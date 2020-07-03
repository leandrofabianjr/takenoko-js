export class Rand {
    static integerBetween(min: number, max: number) {
        return Math.floor(Math.random() * max) + min;
    }
}