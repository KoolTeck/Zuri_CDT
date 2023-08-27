# Task title: Implementing a Cascading Palindrome

## Username: kooljoe

## SID: ZUR000100KL

A palindrome is a word, sentence, verse or number that reads the same backwards or forward. A typical palindrome class will accept a parameter such as a word or number and return true or false if the word is a palindrome. However, your task is to implement a cascading palindrome - a cascading palindrome in the context of this task means the following:

1. The class takes a parameter with several components. The parameter could be a word, a sentence, multiple numbers, etc. The parameter contains various items separated by space.
2. The class determines the part of the parameter that is a palindrome and returns only the palindrome part of the parameter.
   For example:

a. 1230321 returns 1230321
b. 1230321 09234 0124210 returns 1230321 0124210
c. abcd5dcba 1230321 09234 0124210 returns abcd5dcba 1230321 0124210
