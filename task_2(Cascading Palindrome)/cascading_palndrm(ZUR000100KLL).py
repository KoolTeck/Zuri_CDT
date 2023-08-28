"""
    This module implements a cascading Palindrome which entails searching for
    a parameter of components that can be a word, sentence or number and returns
    the palindrome sequence in it.

    The module contains a single class called CascadingPalindrom
    SID: ZUR000100KLL
"""


class CascadingPalindrome:
    """
    Implements a cascading Palindrome
    Params:
        palindrome_str(str): a string of palindrome component(s) delimited by space

    Returns: the palindrome component(s) if found.
    """

    def __init__(self, palindrome_str=str):
        self.palindrome_str = palindrome_str

    @property
    def palindrome_str(self):
        """Returns the palindrome parameter string"""
        return self.__palindrome_str

    @palindrome_str.setter
    def palindrome_str(self, value):
        """Sets a new value for the palindrome_str attribute"""
        off_length = [0, 1, 2]
        if type(value) is not str:
            raise TypeError("Parameter must be a string and dilimited by space")
        elif len(value) in off_length:
            raise ValueError("components must be above 2 chars")
        self.__palindrome_str = value

    def checkPalindrom_method_one(self):
        """
        checks each component in the palindrome string if its a palindrome
        returns the component found to be palindrome.
        """
        palindronme_found = ""
        palindrome_components = (
            self.palindrome_str.split()
        )  # breaks the string of components into a list
        for component in palindrome_components:
            str_len = len(component)
            middle_index = int((str_len - 1) / 2)
            component_str_lower = (
                component.lower()
            )  # converts the string to lower case for proper comparison
            if str_len % 2 == 0:  # checks for even length palindrome component
                if (
                    component_str_lower[middle_index]
                    == component_str_lower[middle_index + 1]
                ):
                    palindronme_found += f"{component} "
            else:  # continues with odd palindrome
                if (
                    component_str_lower[middle_index - 1]
                    == component_str_lower[middle_index + 1]
                ):
                    if self.compare_odd_len_palindrome(component_str_lower):
                        palindronme_found += f"{component} "
                else:
                    continue
        return palindronme_found

    @staticmethod
    def compare_odd_len_palindrome(pal_str):
        """
        compares a string of component
        Returns true if chars are the same
        """
        middle_index = int((len(pal_str) - 1) / 2)
        step_backward = middle_index - 1
        step_foward = middle_index + 1
        is_same_char = False
        for i in range(middle_index):
            if pal_str[step_backward] == pal_str[step_foward]:
                is_same_char = True
            else:
                is_same_char = False
                break
            step_backward -= 1
            step_foward += 1
        return is_same_char

    def checkPalindrom_method_two(self):
        """Method two using slicing"""
        is_palindrome = ""
        palindrome_components = self.palindrome_str.split()
        for component in palindrome_components:
            component_str_lower = component.lower()
            if component_str_lower == component_str_lower[::-1]:
                is_palindrome = f"{is_palindrome + component} "
        return is_palindrome


# using the class
if __name__ == "__main__":
    # using method one  with odd length palindromes
    palindrome = CascadingPalindrome("abcd5dcba 1230321 092343 0124220 1330321 0923290")
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_one())
    print()
    # using method one  with even length palindromes
    palindrome.palindrome_str = "11 22 33 44 2123004212 11244211 01255210"
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_one())
    print()
    # using method one  with odd length palindromes words
    # palindrome.palindrome_str = "Nun Madam Racecar Civic Deified Aibohphobia"
    # print(palindrome.palindrome_str)
    # print(palindrome.checkPalindrom_method_one())
    # print()
    # # using method one  with even length palindromes words
    # palindrome.palindrome_str = "Hannah Tattarrattat Han2anah"
    # print(palindrome.palindrome_str)
    # print(palindrome.checkPalindrom_method_one())
    # # Error checks
    # palindrome.palindrome_str = "Ha" //ValueError: components must be above 2 chars
    # palindrome.palindrome_str = ("aa",) TypeError: Parameter must be a string and dilimited by space
    # print()
    # print("Using method two...........")
    # palindrome = CascadingPalindrome("abcd5dcba 1230321 0923443 0124210 3442552")
    # print(palindrome.palindrome_str)
    # print(palindrome.checkPalindrom_method_two())
    # print()
    # palindrome.palindrome_str = """\
    #             WasitacaroracatIsaw tentative abcd2dcba abcd2acba abcc2dcba Detartrated Murdrum Rotavator Sis Adda saippuakivikauppias 22 99 101 101101 88 234234 234432 1006001 1008001 1010101"""
    # print(palindrome.palindrome_str)
    # print(palindrome.checkPalindrom_method_two())
    # print()
