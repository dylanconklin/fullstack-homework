/** Exercise 01 - Fizzbuzz

Write a program that writes all the numbers from 1 to 100, with some exceptions: 
- For numbers divisible by 3, print “fizz” 
- For numbers divisible by 5 (but not 3), print “buzz” 
- For numbers divisible by 3 and 5, print “fizzbuzz”

Use console.log() to write the proper output to the command line.

**/

function fizzBuzz(x = 0) {
    let result = "";
    if (x % 3 === 0 && x % 5 === 0) {
        result = 'fizzbuzz';
    } else if (x % 3 === 0) {
        result = 'fizz';
    } else if (x % 5 === 0) {
        result = 'buzz';
    } else {
        result = x.toString();
    }
    return result;
}

function main() {
    for (let i = 1; i <= 100; i++) {
        console.log(fizzBuzz(i));
    }
}

main();

// 1
// 2
// fizz
// 4
// buzz
// fizz
// 7
// 8
// fizz
// buzz
// 11
// fizz
// 13
// 14
// fizzbuzz
// ...
