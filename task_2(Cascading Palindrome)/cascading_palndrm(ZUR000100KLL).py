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
        off_length = [0, 1]
        if type(value) is not str:
            raise TypeError("Parameter must be a string and dilimited by space")
        elif len(value) in off_length:
            raise ValueError("components must be above 1 char")
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
            if (
                str_len != 1
                and component_str_lower[middle_index]
                == component_str_lower[middle_index + 1]
            ):  # checks if palindrome component has two same chars at the center
                if self.compare_str(
                    component_str_lower
                ):  # compares the chars of the string
                    palindronme_found += f"{component} "
            elif (
                str_len != 1
                and component_str_lower[middle_index - 1]
                == component_str_lower[middle_index + 1]
            ):  # checks if the char to the right and left of the middle index is same
                if self.compare_str(component_str_lower):
                    palindronme_found += f"{component} "
            else:
                continue
        return palindronme_found

    @staticmethod
    def compare_str(pal_str):
        """
        compares a string of palindrome element
        Returns true if chars are the same
        """
        if type(pal_str) is not str:
            raise TypeError("Param must be a string")
        middle_index = int((len(pal_str) - 1) / 2)
        is_same_char = False
        if len(pal_str) % 2 != 0:  # checks if pal_str is of odd length or not
            step_backward = middle_index - 1
            step_foward = middle_index + 1
            for i in range(middle_index):
                if pal_str[step_backward] == pal_str[step_foward]:
                    is_same_char = True
                else:
                    is_same_char = False
                    break
                step_backward -= 1
                step_foward += 1
        else:  # continues with even length str
            end_index = len(pal_str) - 1
            if len(pal_str) == 2:  # to be able to compare strings of two chars
                middle_index = 1
            for i in range(middle_index):
                if pal_str[i] == pal_str[end_index]:
                    is_same_char = True
                else:
                    is_same_char = False
                    break
                end_index -= 1
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
    # using method one  with odd length components
    palindrome = CascadingPalindrome("abcd5dcba 1230321 092343 0124220 1330321 0923290")
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_one())
    print()
    # using method one  with even and odd length components
    palindrome.palindrome_str = "11 1 12 22 23 33 34 44 45 111 1111 1222 333333 323343 2123004212 11244211 01255210"
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_one())
    print()
    # using method one  with odd length palindromes words
    palindrome.palindrome_str = "Nun Madam Racecar Civic Deified Aibohphobia"
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_one())
    print()
    # # using method one  with even length palindromes words
    palindrome.palindrome_str = "Hannah Tattarrattat Han2anah"
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_one())
    palindrome.palindrome_str = """WasitacaroracatIsaw tentative abcd2dcba abcd2acba abcc2dcba Detartrated Murdrum Rotavator Sis Adda saippuakivikauppias 22 99 101 101101 88 234234 234432 1006001 1008001 1010101 WasitacaroracatIsawe tentative abcd2decba abcd2aceba abcc2d55cba Detartr34ated Murdrums Rotavatorss Sis Adda saippuakidevikauppias 22ee 9e9 1e01 101101 88 234234 234432e 10064001 10048001 1010101
                """
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_one())
    print()
    # # Error checks
    # palindrome.palindrome_str = "H" //ValueError: components must be above 1 char
    # palindrome.palindrome_str = ("aa",) TypeError: Parameter must be a string and dilimited by space
    print()
    print("Using method two...........")
    palindrome = CascadingPalindrome("abcd5dcba 1230321 0923443 0124210 3442552")
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_two())
    print()
    palindrome.palindrome_str = """WasitacaroracatIsaw tentative abcd2dcba abcd2acba abcc2dcba Detartrated Murdrum Rotavator Sis Adda saippuakivikauppias 22 99 101 101101 88 234234 234432 1006001 1008001 1010101 WasitacaroracatIsawe tentative abcd2decba abcd2aceba abcc2d55cba Detartr34ated Murdrums Rotavatorss Sis Adda saippuakidevikauppias 22ee 9e9 1e01 101101 88 234234 234432e 10064001 10048001 1010101
                """
    print(palindrome.palindrome_str)
    print(palindrome.checkPalindrom_method_two())
    print()
