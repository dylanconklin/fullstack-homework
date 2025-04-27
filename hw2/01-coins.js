/** Exercise 01 - Coins **/

// Add your function here 

class Change {
    dollars = 0;
    quarters = 0;
    dimes = 0;
    nickels = 0;
    pennies = 0;

    toString = function toStringDefinition() {
        return [
            [this.dollars, "dollar", "dollars"],
            [this.quarters, "quarter", "quarters"],
            [this.dimes, "dime", "dimes"],
            [this.nickels, "nickel", "nickels"],
            [this.pennies, "penny", "pennies"],
        ]
            .filter((e) => e[0] > 0)
            .map((e) => e[0] === 1 ? [e[0], e[1]] : [e[0], e[2]])
            .map((e) => e.join(" "))
            .join(", ");
    }

    constructor(change) {
        this.dollars = Math.trunc(change)
        change = Math.trunc(Math.round((change - this.dollars) * 100))
        while (change >= 25) {
            change -= 25;
            this.quarters += 1;
        }
        while (change >= 10) {
            change -= 10;
            this.dimes += 1;
        }
        while (change >= 5) {
            change -= 5;
            this.nickels += 1;
        }
        this.pennies = change;
    }
}

let calculateChange = function calculateChangeDefinition(change = 0) {
    let result = "";
    if (change < 0) {
        result = "Error: the number is negative";
    } else if (change > 100) {
        result = "Error: the number is too large";
    } else {
        let changeObj = new Change(change);
        result = changeObj.toString();
        if (result.length === 0) {
            result = "No change";
        }
    }
    return result;
}

// Sample test cases
console.log(calculateChange(4.62));
// $4.62 ==> 4 dollars, 2 quarters, 1 dime, 2 pennies
console.log(calculateChange(0.16));
// $0.16 ==> 1 dime, 1 nickel, 1 penny
console.log(calculateChange(150.11));
// $150.11 ==> Error: the number is too large
console.log(calculateChange());
// EMPTY ==> No change
console.log(calculateChange(-0.01));
// $-0.01 ==> Error: the number is negative
console.log(calculateChange(0));
// $0 ==> No change
console.log(calculateChange(0.01));
// $0.01 ==> 1 penny
console.log(calculateChange(99.99));
// $99.99 ==> 99 dollars, 3 quarters, 2 dimes, 4 pennies
console.log(calculateChange(100.00));
// $100.00 ==> 100 dollars
console.log(calculateChange(100.01));
// $150.11 ==> Error: the number is too large