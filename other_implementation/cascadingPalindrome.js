// an implementation of the Cascading Palindrome in JS
// To cater for parameters in sentence format

/*
    Initiate a new palindrome object
    @param: palimstr(string) - the search string
    
*/

import { log } from "console";
import { fileURLToPath } from "url";
import { isStringObject } from "util/types";

class CascadingPalindrome {
  constructor(palimStr = "010") {
    this.palimStr = palimStr;
  }

  get palimStr() {
    // Returns the palimstr value
    return this.__palimStr;
  }

  set palimStr(value) {
    // sets  a new value for the palimStr property
    if (value === "" || value.length === 1) {
      throw "value must not be empty and must be above 1 char";
    } else if (typeof value !== "string") {
      console.log(typeof value);
      throw "value must be a string";
    }
    value = value.trim();
    this.__palimStr = value;
  }

  /**
   * checks for the an ocurence of palindrome element in the string supplied
   * @returns {string} The elements if found
   */
  checkForPalindromeElement() {
    let isPalindrome = "";
    let palindromeElements;
    let component;

    // checks if the string contains a sentence
    if (this.palimStr.includes("(") && this.palimStr.includes(")")) {
      palindromeElements = this.palimStr.split("("); //split the string on open bracket to get sentence
      for (const i in palindromeElements) {
        component = palindromeElements[i].trim();
        let midIndex;
        // checks for sentence
        if (component.endsWith(")") && component.length != 1) {
          component = component.replace(/[^\w]|_/g, ""); // removes whitespace and special chars from the snetence
          midIndex = (component.length - 1) / 2;
          // checks if the sentence has two same chars in the middle meaning it has an even length
          if (component[midIndex] === component[midIndex + 1]) {
            if (this.comPareChars(component.toLowerCase())) {
              isPalindrome += `(${palindromeElements[i]} `;
            }
          }
          // checks sentence for odd length sentence
          else if (component[midIndex - 1] === component[midIndex + 1]) {
            if (this.comPareChars(component.toLowerCase())) {
              isPalindrome += `(${palindromeElements[i]} `;
            }
            continue;
          }
        }
        //   continues with words and numbers
        else {
          const wordsNum = component.split(" ");

          for (let i = 0; i < wordsNum.length; i++) {
            const value = wordsNum[i];
            midIndex = (value.length - 1) / 2;

            if (value[midIndex] === value[midIndex + 1]) {
              if (this.comPareChars(value.toLowerCase())) {
                isPalindrome += `${[value]} `;
              }
            }
            // checks value for odd length
            else if (value[midIndex - 1] === value[midIndex + 1]) {
              if (this.comPareChars(value.toLowerCase())) {
                isPalindrome += `${[value]} `;
              }
              continue;
            }
          }
        }
      }
    } else {
      // continue with words and num only
      palindromeElements = this.palimStr.split(" "); //split the string on open space to get word or num
      for (const i in palindromeElements) {
        component = palindromeElements[i].trim();
        const len = component.length;
        const midIndex = (len - 1) / 2;
        if (component[midIndex] === component[midIndex + 1]) {
          if (this.comPareChars(component.toLowerCase())) {
            isPalindrome += `${palindromeElements[i]} `;
          }
        } else if (component[midIndex - 1] === component[midIndex + 1]) {
          if (this.comPareChars(component.toLowerCase())) {
            isPalindrome += `${palindromeElements[i]} `;
          }
          continue;
        }
      }
    }

    return isPalindrome;
  }

  /** compares chars of string
   *  @param  {string} str the string to perform comparsion on
   * @returns {boolean} returns true if all chars are the same
   */
  comPareChars(str) {
    const strLen = str.length;
    const midIndex = (strLen - 1) / 2;
    let end = strLen - 1;
    let isSameChar = false;
    if (typeof str !== "string") {
      throw "value must be a string";
    }
    for (let start = 0; start < midIndex; start++) {
      if (str[start] === str[end]) {
        isSameChar = true;
        end--;
      } else {
        isSameChar = false;
        break;
      }
    }
    return isSameChar;
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const palindrome = new CascadingPalindrome();
  palindrome.palimStr =
    "1234321 111 101 Nun Madam Racecar Civic Deified Aibohphobia (A man_, a plan, a canal – Panama) (A man_, a plan, a ccanal – Panama) (A man_, a pldan, a canal – Panama)";
  console.log(palindrome.palimStr);
  console.log(palindrome.checkForPalindromeElement());
  palindrome.palimStr =
    "Nun Madam Racecar Civic Deified Aibohphobia 123a321v123098 23333 sheep 11 22 33 4 44 55 ";
  console.log(palindrome.palimStr);
  console.log(palindrome.checkForPalindromeElement());
}

export default CascadingPalindrome;
