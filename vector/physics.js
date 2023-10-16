export class Vector {
    constructor(x, y) {
        this.x = 0 || x;
        this.y = 0 || y;
    }

    copy() {
        return new Vector(this.x, this.y);
    }

    equals(v) {
        return v.x == this.x && v.y == this.y;
    }

    add(v) {
        return new Vector(v.x + this.x, v.y + this.y);
    }

    subtract(v) {
        return new Vector(this.x - v.x, this.y - v.y);
    }

    mulScalar(s) {
        return new Vector(s * this.x, s * this.y);
    }

    mul(v) {
        return new Vector(v.x * this.x, v.y * this.y);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalise() {
        let vecLength = this.length();
        return new Vector(this.x / vecLength, this.y / vecLength);
    }

    rotate(angle) {
        let a = new Vector(Math.cos(angle), Math.sin(angle));
        let b = new Vector(-Math.sin(angle), Math.cos(angle));
        return a.mulScalar(this.x).add(b.mulScalar(this.y));
    }

    dotProduct(vector) {
        let dotProduct = this.x * vector.x + this.y * vector.y;
        return dotProduct;
    }
    
    determinant(vector) {
        let determinant = this.x * vector.y - this.y * vector.x;
        return determinant;
    }

    angle(vector) {
        let dot = this.dotProduct(vector);
        let det = this.determinant(vector);
        return Math.atan2(det, dot);
    }

    toString() {
        return "(" + this.x.toFixed(2) + "|" + this.y.toFixed(2) + ")";
    }

}